import { randomUUID } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { ToolRegistry } from '../orchestrator/tool-registry.js';

const PROTOCOL_VERSION = '2025-03-26';

export interface McpToolExecutor {
  listTools(): Array<{ name: string; description: string; inputSchema: Record<string, unknown> }>;
  callTool(name: string, args: Record<string, unknown>): Promise<{ success: boolean; message: string; data?: unknown }>;
}

interface JsonRpc {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, unknown>;
}

const sessions = new Map<string, number>();

export function toolRegistryExecutor(registry: ToolRegistry): McpToolExecutor {
  return {
    listTools() {
      return registry.getToolDefinitions().map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.parameters,
      }));
    },
    callTool(name, args) {
      return registry.executeToolCall(name, args);
    },
  };
}

export async function handleMcpHttp(req: IncomingMessage, res: ServerResponse, executor: McpToolExecutor): Promise<void> {
  if (req.method === 'DELETE') {
    const session = header(req, 'mcp-session-id');
    if (session) sessions.delete(session);
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    sendRpc(res, null, errorBody(-32601, 'Athena MCP accepts POST. Server-sent events are not offered.'), 405);
    return;
  }

  let message: JsonRpc;
  try {
    message = JSON.parse(await readBody(req)) as JsonRpc;
  } catch {
    sendRpc(res, null, errorBody(-32700, 'Invalid JSON.'), 400);
    return;
  }

  if (!message || message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
    sendRpc(res, message?.id ?? null, errorBody(-32600, 'Invalid JSON-RPC request.'), 400);
    return;
  }

  const isNotification = message.id === undefined || message.method.startsWith('notifications/');
  if (isNotification) {
    res.statusCode = 202;
    res.end();
    return;
  }

  try {
    const result = await dispatch(executor, message, header(req, 'mcp-session-id'));
    if (result.sessionId) res.setHeader('Mcp-Session-Id', result.sessionId);
    sendRpc(res, message.id ?? null, result.error ? { error: result.error } : { result: result.result });
  } catch (err) {
    const text = err instanceof Error ? err.message : 'Tool call failed.';
    sendRpc(res, message.id ?? null, errorBody(-32603, text), 500);
  }
}

async function dispatch(
  executor: McpToolExecutor,
  message: JsonRpc,
  sessionId: string | undefined,
): Promise<{ result?: unknown; error?: { code: number; message: string }; sessionId?: string }> {
  if (message.method === 'initialize') {
    const id = randomUUID();
    sessions.set(id, Date.now());
    trimSessions();
    const requested = String(message.params?.protocolVersion || PROTOCOL_VERSION);
    return {
      sessionId: id,
      result: {
        protocolVersion: requested.startsWith('2024-') || requested.startsWith('2025-') ? requested : PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'athena-agent', version: '2.0.0' },
      },
    };
  }

  if (message.method !== 'ping' && !sessionId) {
    return { error: { code: -32600, message: 'Missing Mcp-Session-Id. Call initialize first.' } };
  }
  if (sessionId && !sessions.has(sessionId)) {
    return { error: { code: -32600, message: 'Unknown MCP session.' } };
  }

  if (message.method === 'ping') return { result: {} };

  if (message.method === 'tools/list') {
    return { result: { tools: executor.listTools() } };
  }

  if (message.method === 'tools/call') {
    const name = String(message.params?.name || '');
    const args = (message.params?.arguments && typeof message.params.arguments === 'object'
      ? message.params.arguments
      : {}) as Record<string, unknown>;
    if (!name) return { error: { code: -32602, message: 'tools/call requires a name.' } };
    const known = executor.listTools().some((tool) => tool.name === name);
    if (!known) return { error: { code: -32602, message: `Unknown tool ${name}.` } };
    const outcome = await executor.callTool(name, args);
    const text = outcome.data !== undefined
      ? `${outcome.message}\n${JSON.stringify(outcome.data)}`
      : outcome.message;
    return {
      result: {
        content: [{ type: 'text', text }],
        isError: !outcome.success,
      },
    };
  }

  return { error: { code: -32601, message: `Method ${message.method} is not supported.` } };
}

function trimSessions(): void {
  if (sessions.size <= 100) return;
  const oldest = [...sessions.entries()].sort((a, b) => a[1] - b[1])[0];
  if (oldest) sessions.delete(oldest[0]);
}

function header(req: IncomingMessage, name: string): string | undefined {
  const value = req.headers[name];
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function errorBody(code: number, message: string): { error: { code: number; message: string } } {
  return { error: { code, message } };
}

function sendRpc(res: ServerResponse, id: string | number | null, body: Record<string, unknown>, status = 200): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ jsonrpc: '2.0', id, ...body }));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}
