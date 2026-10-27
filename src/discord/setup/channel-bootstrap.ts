import { Guild, ChannelType } from 'discord.js';

export interface ChannelSetupResult {
  controlRoomId: string;
  auditOnDemandId: string;
  memeEvmId: string;
  lpEvmId: string;
  nftId: string;
  alphaEvmId: string;
  whaleEthId: string;
}

export async function bootstrapDiscordChannels(guild: Guild): Promise<ChannelSetupResult> {
  console.log(`[DISCORD BOOTSTRAP] Checking & auto-creating Athena channels in guild: "${guild.name}"...`);

  // 1. Check or Create Category "⚡ ATHENA COMMAND CENTER"
  let category = guild.channels.cache.find(
    c =>
      c.type === ChannelType.GuildCategory &&
      (c.name.toLowerCase().includes('athena command center') ||
        c.name.toLowerCase().includes('noraz command center') ||
        c.name.toLowerCase().includes('opencatz command center') ||
        c.name.toLowerCase().includes('opencat command center'))
  );

  if (!category) {
    category = await guild.channels.create({
      name: '⚡ ATHENA COMMAND CENTER',
      type: ChannelType.GuildCategory,
    });
    console.log('[DISCORD BOOTSTRAP] Created Category: "⚡ ATHENA COMMAND CENTER"');
  }

  // Helper to get or create channel under category
  const getOrCreateChannel = async (name: string, topic: string, altNames: string[] = []) => {
    let channel = guild.channels.cache.find(
      c => c.type === ChannelType.GuildText && (c.name === name || altNames.includes(c.name))
    );

    if (!channel) {
      channel = await guild.channels.create({
        name,
        type: ChannelType.GuildText,
        parent: category.id,
        topic,
      });
      console.log(`[DISCORD BOOTSTRAP] Auto-created Channel: #${name}`);
    }
    return channel.id;
  };

  const controlRoomId = await getOrCreateChannel(
    'athena-control-room',
    '⚡ Athena Core Command Hub — chat, wallets, risk, and desk control.',
    ['noraz-control-room', 'opencatz-control-room', 'opencat-control-room', 'control-room']
  );

  const auditOnDemandId = await getOrCreateChannel(
    'athena-audit',
    '🔎 On-Demand Token Audit Channel - Paste any BNB Chain contract address here for an instant audit.',
    ['noraz-audit', 'opencatz-audit', 'opencat-audit', 'audit-on-demand']
  );

  const memeEvmId = await getOrCreateChannel(
    'call-meme-robinhood',
    '🌸 BSC Meme Scout — new BNB Chain names, smart money, and pad origin'
  );

  const lpEvmId = await getOrCreateChannel(
    'call-lp-robinhood',
    '🌊 BSC LP Scout — PancakeSwap V3 fee velocity on BNB Chain'
  );

  const nftId = await getOrCreateChannel(
    'call-nft-robinhood',
    '🔮 BSC NFT Scout — OpenSea floor shocks and sweeps on BNB Chain'
  );

  const alphaEvmId = await getOrCreateChannel(
    'call-alpha-robinhood',
    '☀️ BSC Narrative Scout — 1-hour BNB Chain rank and X heat'
  );

  const whaleEthId = await getOrCreateChannel(
    'call-whale-eth',
    '🐋 Smart Trader & Whale Tracking on Hyperliquid (ETH Perps & Spot Flow)'
  );

  console.log('[DISCORD BOOTSTRAP] Athena BNB Chain channels are ready.');

  return {
    controlRoomId,
    auditOnDemandId,
    memeEvmId,
    lpEvmId,
    nftId,
    alphaEvmId,
    whaleEthId,
  };
}
