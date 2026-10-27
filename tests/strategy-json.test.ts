import { describe, it, expect, afterEach } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { StrategyEngine } from '../src/orchestrator/strategy-engine.js';
import { parseStrategyDocument } from '../src/orchestrator/strategy-json.js';

const dirs: string[] = [];

afterEach(() => {
  for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true });
});

function tempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'athena-strategy-'));
  dirs.push(dir);
  return dir;
}

const MODULE = `
export default {
  id: 'meme-robinhood-default',
  name: 'Test',
  version: '1.0.0',
  description: 'Test',
  params: { passThreshold: 80, minLiquidityUsd: 5000 },
  evaluate(ctx) {
    const min = this.params.minLiquidityUsd;
    return {
      confidence: ctx.liquidityUsd >= min ? 85 : 0,
      recommendedAction: ctx.liquidityUsd >= min ? 'BUY' : 'SKIP',
      reason: String(min),
    };
  },
};
`;

describe('strategy json', () => {
  it('rejects a file that drops the quality floor below 80', () => {
    const result = parseStrategyDocument({
      schema: 'athena.strategy/v1',
      domains: { 'meme-robinhood': { params: { passThreshold: 50 } } },
    });
    expect(result.ok).toBe(false);
  });

  it('rejects unknown fields', () => {
    const result = parseStrategyDocument({
      schema: 'athena.strategy/v1',
      domains: { 'meme-robinhood': { params: { minLiquidityUsd: 5000, code: 1 } } },
    });
    expect(result.ok).toBe(false);
  });

  it('overlays strategies.json onto the domain module', () => {
    const dir = tempDir();
    fs.writeFileSync(path.join(dir, 'meme-robinhood-default.mjs'), MODULE);
    fs.writeFileSync(
      path.join(dir, 'strategies.json'),
      JSON.stringify({
        schema: 'athena.strategy/v1',
        domains: { 'meme-robinhood': { params: { minLiquidityUsd: 25000 } } },
      }),
    );

    const engine = new StrategyEngine({ strategiesDir: dir, indicatorsDir: path.join(dir, 'indicators') });
    const strategy = engine.getActiveStrategy('meme-robinhood');
    expect(strategy?.params.minLiquidityUsd).toBe(25000);
    expect(strategy?.params.passThreshold).toBe(80);

    const passed = engine.runStrategySafely(strategy!, 'evaluate', { liquidityUsd: 30000 });
    const blocked = engine.runStrategySafely(strategy!, 'evaluate', { liquidityUsd: 10000 });
    expect(passed.recommendedAction).toBe('BUY');
    expect(blocked.recommendedAction).toBe('SKIP');
    expect(blocked.reason).toBe('25000');
  });
});
