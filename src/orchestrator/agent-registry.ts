export type AgentDomainId =
  | 'meme-robinhood'
  | 'lp-robinhood'
  | 'nft'
  | 'alpha-robinhood'
  | 'whale-eth';

export type AgentCategory = 'MEME' | 'LP' | 'NFT' | 'ALPHA' | 'WHALE';

export interface AgentDomainInfo {
  id: AgentDomainId;
  displayName: string;
  name: string;
  channel: string;
  aliases: string[];
  requiredKeys: string[];
  category: AgentCategory;
}

export const AGENT_DOMAINS: AgentDomainInfo[] = [
  {
    id: 'meme-robinhood',
    displayName: 'BSC-MEME',
    name: 'BSC Meme Scout',
    channel: 'call-meme-robinhood',
    aliases: ['bsc-meme', 'bsc', 'meme', 'robinhood', 'evm', 'evm-meme', 'meme-evm'],
    requiredKeys: ['AI_API_KEY'],
    category: 'MEME',
  },
  {
    id: 'lp-robinhood',
    displayName: 'BSC-LP',
    name: 'BSC LP Scout',
    channel: 'call-lp-robinhood',
    aliases: ['bsc-lp', 'pancake', 'pancakeswap', 'uniswap', 'evm-lp', 'robinhood-lp'],
    requiredKeys: ['KRYSTAL_CLOUD_API_KEY', 'GMGN_API_KEY', 'AI_API_KEY'],
    category: 'LP',
  },
  {
    id: 'nft',
    displayName: 'BSC-NFT',
    name: 'BSC NFT Scout',
    channel: 'call-nft-robinhood',
    aliases: ['opensea', 'nft-sniper'],
    requiredKeys: ['OPENSEA_API_KEY', 'AI_API_KEY'],
    category: 'NFT',
  },
  {
    id: 'alpha-robinhood',
    displayName: 'BSC-NARRATIVE',
    name: 'BSC Narrative Scout',
    channel: 'call-alpha-robinhood',
    aliases: ['bsc-narrative', 'narrative', 'alpha', 'rh-alpha', 'alpha-scraper', 'x-alpha'],
    requiredKeys: ['AI_API_KEY'],
    category: 'ALPHA',
  },
  {
    id: 'whale-eth',
    displayName: 'WHALE-ETH',
    name: 'Hyperliquid ETH Whale & Smart-Money Positioning',
    channel: 'call-whale-eth',
    aliases: ['whale', 'eth-whale', 'hyperliquid', 'whale-tracking', 'whale-eth'],
    requiredKeys: [],
    category: 'WHALE',
  },
];

function canonicalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/^call-/, '')
    .replace(/-token$/, '');
}

export function getAgentDomain(idOrAlias: string): AgentDomainInfo | undefined {
  const key = canonicalize(idOrAlias);
  return AGENT_DOMAINS.find(
    (d) => d.id === key || d.aliases.some((a) => a === key) || d.channel === idOrAlias.toLowerCase()
  );
}

export function normalizeDomainKey(idOrAlias: string): string {
  return getAgentDomain(idOrAlias)?.id ?? canonicalize(idOrAlias);
}
