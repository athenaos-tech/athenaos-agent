import { describe, it, expect } from 'vitest';
import { EventEmitter } from 'node:events';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleMcpHttp, type McpToolExecutor } from '../src/mcp/server.js';

function executor(): McpToolExecutor {
  return {
    listTools: () => [{
      name: 'get_agent_statuses',
      description: 'List agents',
      inputSchema: { type: 'object', properties: {} },
    }],
    callTool: async (name) => ({ success: true, message: `ran ${name}` }),
  };
}

function call(method: string, body: string, headers: Record<string, string> = {}): Promise<{ status: number; body: string; session?: string }> {
  const req = new EventEmitter() as IncomingMessage;
  req.method = method;
  req.headers = headers;
  let status = 0;
  let session: string | undefined;
  let raw = '';
  const res = {
    statusCode: 0,
    setHeader(name: string, value: string) {
      if (name.toLowerCase() === 'mcp-session-id') session = value;
    },
    end(chunk?: string) {
      status = res.statusCode;
      raw = chunk || '';
    },
  } as unknown as ServerResponse;

  const pending = handleMcpHttp(req, res, executor());
  queueMicrotask(() => {
    req.emit('data', Buffer.from(body));
    req.emit('end');
  });
  return pending.then(() => ({ status, body: raw, session }));
}

describe('MCP server', () => {
  it('lists tools after initialize', async () => {
    const init = await call('POST', JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2025-03-26' },
    }));
    expect(init.status).toBe(200);
    expect(init.session).toBeTruthy();
    const listed = JSON.parse(init.body);
    expect(listed.result.serverInfo.name).toBe('athena-agent');

    const tools = await call('POST', JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
    }), { 'mcp-session-id': init.session! });
    const payload = JSON.parse(tools.body);
    expect(payload.result.tools[0].name).toBe('get_agent_statuses');
  });

  it('runs a tool call and rejects an unknown tool', async () => {
    const init = await call('POST', JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} }));
    const ok = await call('POST', JSON.stringify({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: { name: 'get_agent_statuses', arguments: {} },
    }), { 'mcp-session-id': init.session! });
    expect(JSON.parse(ok.body).result.isError).toBe(false);

    const missing = await call('POST', JSON.stringify({
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: { name: 'nope', arguments: {} },
    }), { 'mcp-session-id': init.session! });
    expect(JSON.parse(missing.body).error.code).toBe(-32602);
  });
});
