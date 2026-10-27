import fs from 'fs';
import path from 'path';

export const STRATEGY_SCHEMA = 'athena.strategy/v1';
const LEGACY_STRATEGY_SCHEMA = 'noraz.strategy/v1';
export const STRATEGY_FILE = 'strategies.json';

export const STRATEGY_DOMAINS = ['meme-robinhood', 'lp-robinhood', 'nft', 'whale-eth'] as const;
export type StrategyDomain = (typeof STRATEGY_DOMAINS)[number];

type Bound = { min: number; max: number; integer?: boolean };

const PASS: Bound = { min: 80, max: 99, integer: true };

export const STRATEGY_PARAM_SPEC: Record<StrategyDomain, Record<string, Bound>> = {
  'meme-robinhood': {
    passThreshold: PASS,
    minVolume24hUsd: { min: 0, max: 1_000_000_000 },
    minLiquidityUsd: { min: 0, max: 1_000_000_000 },
    minAgeHours: { min: 0, max: 168 },
    maxRugRatio: { min: 0.01, max: 1 },
    maxRatTraderRate: { min: 0.01, max: 1 },
    maxTop10HolderRate: { min: 0.01, max: 1 },
    minVisitingCount: { min: 0, max: 10_000_000, integer: true },
    maxTwitterRenameCount: { min: 0, max: 100, integer: true },
    maxTwitterDelPostCount: { min: 0, max: 100, integer: true },
    maxTwitterCreateTokenCount: { min: 0, max: 100, integer: true },
    minTotalFeeUsd: { min: 0, max: 1_000_000 },
    prefilterVolume1hUsd: { min: 0, max: 1_000_000_000 },
    prefilterLiquidityUsd: { min: 0, max: 1_000_000_000 },
    prefilterTotalFeeUsd: { min: 0, max: 1_000_000 },
    prefilterRugRatio: { min: 0.01, max: 1 },
    prefilterRatTraderRate: { min: 0.01, max: 1 },
    prefilterTop10HolderRate: { min: 0.01, max: 1 },
  },
  'lp-robinhood': {
    passThreshold: PASS,
    minTvlUsd: { min: 0, max: 1_000_000_000_000 },
    minVol24hUsd: { min: 0, max: 1_000_000_000_000 },
    minFeeTvlRatio24h: { min: 0, max: 1 },
    minMarketCapUsd: { min: 0, max: 1_000_000_000_000 },
  },
  nft: {
    passThreshold: PASS,
    minFloorEth: { min: 0, max: 1000 },
    minSurgePct: { min: 0, max: 1000 },
    minVolSpike: { min: 0, max: 100 },
    minVelocity1h: { min: 0, max: 10_000 },
    prefilterSurgePct: { min: 0, max: 1000 },
    prefilterVolSpike: { min: 0, max: 100 },
    prefilterVelocity1h: { min: 0, max: 10_000 },
  },
  'whale-eth': {
    passThreshold: PASS,
    minPerpsUsd: { min: 0, max: 1_000_000_000_000 },
    minSpotUsd: { min: 0, max: 1_000_000_000_000 },
    minWhaleCount: { min: 1, max: 100, integer: true },
  },
};

export interface StrategyDocument {
  schema: typeof STRATEGY_SCHEMA;
  domains: Partial<Record<StrategyDomain, { params: Record<string, number> }>>;
}

export function parseStrategyDocument(input: unknown): { ok: true; doc: StrategyDocument } | { ok: false; error: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, error: 'Strategy file must be a JSON object.' };
  }
  const raw = input as Record<string, unknown>;
  const extra = Object.keys(raw).filter((key) => key !== 'schema' && key !== 'domains');
  if (extra.length > 0) {
    return { ok: false, error: `Unknown top-level field: ${extra[0]}.` };
  }
  if (raw.schema !== STRATEGY_SCHEMA && raw.schema !== LEGACY_STRATEGY_SCHEMA) {
    return { ok: false, error: `Schema must be ${STRATEGY_SCHEMA} (legacy ${LEGACY_STRATEGY_SCHEMA} accepted).` };
  }
  if (!raw.domains || typeof raw.domains !== 'object' || Array.isArray(raw.domains)) {
    return { ok: false, error: 'domains must be an object.' };
  }
  const domainEntries = Object.entries(raw.domains as Record<string, unknown>);
  if (domainEntries.length === 0) {
    return { ok: false, error: 'Add at least one domain: meme-robinhood, lp-robinhood, nft, whale-eth.' };
  }

  const domains: StrategyDocument['domains'] = {};
  for (const [domain, value] of domainEntries) {
    if (!STRATEGY_DOMAINS.includes(domain as StrategyDomain)) {
      return { ok: false, error: `Unknown domain ${domain}.` };
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return { ok: false, error: `${domain} must be an object with params.` };
    }
    const body = value as Record<string, unknown>;
    const bodyExtra = Object.keys(body).filter((key) => key !== 'params');
    if (bodyExtra.length > 0) {
      return { ok: false, error: `${domain}.${bodyExtra[0]} is not allowed. Put numbers under params.` };
    }
    if (!body.params || typeof body.params !== 'object' || Array.isArray(body.params)) {
      return { ok: false, error: `${domain}.params must be an object.` };
    }
    const spec = STRATEGY_PARAM_SPEC[domain as StrategyDomain];
    const params: Record<string, number> = {};
    for (const [key, paramValue] of Object.entries(body.params as Record<string, unknown>)) {
      const bound = spec[key];
      if (!bound) return { ok: false, error: `${domain}.params.${key} is not a strategy field.` };
      if (typeof paramValue !== 'number' || !Number.isFinite(paramValue)) {
        return { ok: false, error: `${domain}.params.${key} must be a number.` };
      }
      if (paramValue < bound.min || paramValue > bound.max) {
        return { ok: false, error: `${domain}.params.${key} must be between ${bound.min} and ${bound.max}.` };
      }
      if (bound.integer && !Number.isInteger(paramValue)) {
        return { ok: false, error: `${domain}.params.${key} must be a whole number.` };
      }
      params[key] = paramValue;
    }
    domains[domain as StrategyDomain] = { params };
  }

  return { ok: true, doc: { schema: STRATEGY_SCHEMA, domains } };
}

export function loadStrategyFile(strategiesDir: string): { doc: StrategyDocument | null; error?: string } {
  const file = path.join(strategiesDir, STRATEGY_FILE);
  if (!fs.existsSync(file)) return { doc: null };
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return { doc: null, error: `${STRATEGY_FILE} is not valid JSON. Using the built-in strategy modules.` };
  }
  const result = parseStrategyDocument(parsed);
  if (!result.ok) {
    return { doc: null, error: `${STRATEGY_FILE}: ${result.error} Using the built-in strategy modules.` };
  }
  return { doc: result.doc };
}
