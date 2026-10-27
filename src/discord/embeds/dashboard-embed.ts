import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { AthenaHub } from '../../orchestrator/hub.js';
import { AGENT_DOMAINS } from '../../orchestrator/agent-registry.js';
import { isDryRun as isDryRunMode, getExecutionMode } from '../../config/config.js';

export interface DashboardEmbedOptions {
  ethBalance?: string | null;
  activeAlerts?: number;
}

export function createDashboardComponents(hub: AthenaHub, opts: DashboardEmbedOptions = {}) {
  const isOpenSeaSet = Boolean(process.env.OPENSEA_API_KEY);
  const isLlmSet = Boolean(process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY);

  const getStatusBadge = (domain: string) => (hub.isAgentActive(domain) ? '`🟢 RUNNING`' : '`🔴 PAUSED`');

  const risk = hub.getRiskManager().getRiskState();
  const executionMode = getExecutionMode();
  const tp1 = process.env.DEFAULT_TP1_PCT || '100';
  const tp2 = process.env.DEFAULT_TP2_PCT || '200';
  const sl = process.env.DEFAULT_SL_PCT || '-50';
  const drawdownStr = `Current Drawdown: \`${risk.currentDrawdownPct.toFixed(1)}%\` (Max Limit: \`${risk.maxDrawdownLimitPct.toFixed(1)}%\`)`;
  const ethBalanceStr = opts.ethBalance ?? '`— (unavailable)`';
  const activeAlertsStr = `${opts.activeAlerts ?? 0} Active Alerts`;

  const embed = new EmbedBuilder()
    .setTitle('⚡ ATHENA MULTI-AGENT CONTROL CENTER 🐾')
    .setColor(0xccff00)
    .setDescription(
      'Welcome to the **Athena Autonomous Multi-Agent Command Center**.\n' +
      'Control screening agents, risk limits, price alerts, API keys, and burner wallets interactively below.'
    )
    .addFields(
      {
        name: '⚙️ Operating Mode & Risk Safeguards',
        value:
          `• **Execution Mode:** \`${executionMode}\` (Primary Venue: \`PancakeSwap V3 • BNB Chain\`)\n` +
          `• **Auto TP/SL Targets:** TP1: \`+${tp1}%\` | TP2: \`+${tp2}%\` | SL: \`${sl}%\`\n` +
          `• ${drawdownStr}`,
        inline: false,
      },
      {
        name: '🤖 24/7 BNB Chain Scouts (PAUSED by Default)',
        value:
          `• 🌸 **BSC Meme Scout:** ${getStatusBadge('meme-robinhood')}\n` +
          `• 🌊 **BSC LP Scout:** ${getStatusBadge('lp-robinhood')}\n` +
          `• 🔮 **BSC NFT Scout:** ${getStatusBadge('nft')}\n` +
          `• ☀️ **BSC Narrative Scout:** ${getStatusBadge('alpha-robinhood')}`,
        inline: false,
      },
      {
        name: '🌐 Connected API Keys & Security Status',
        value:
          `• 🖼️ **OpenSea API (NFT Data):** ${isOpenSeaSet ? '`🟢 CONFIGURED`' : '`⚪ NOT CONFIGURED (fail-closed)`'}\n` +
          `• 🐦 **X (Twitter) API v2:** ${Boolean(process.env.X_API_BEARER_TOKEN) ? '`🟢 CONFIGURED`' : '`⚪ NOT CONFIGURED (optional)`'}\n` +
          `• 🧠 **LLM AI Reasoning API:** ${isLlmSet ? '`🟢 CONFIGURED`' : '`⚪ NOT CONFIGURED`'}`,
        inline: false,
      },
      {
        name: '🔑 Wallet Balances & Active Alerts',
        value:
          `• **BNB Chain Balance:** ${ethBalanceStr}\n` +
          `• **Active Price Alerts:** \`${activeAlertsStr}\` (Use \`/alert\` or ask in chat)`,
      }
    )
    .setFooter({ text: 'Athena desk • PancakeSwap V3 on BNB Chain' })
    .setTimestamp();

  // Dropdown Select Menu to Toggle Agents
  const CATEGORY_EMOJI: Record<string, string> = {
    MEME: '🌸', LP: '🌊', NFT: '🔮', ALPHA: '☀️',
  };
  const agentSelect = new StringSelectMenuBuilder()
    .setCustomId('select_toggle_agent')
    .setPlaceholder('👇 Select a Sub-Agent to Toggle (START / PAUSE)')
    .addOptions(
      ...AGENT_DOMAINS.map((d) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(d.displayName.replace(/-/g, ' '))
          .setValue(d.id)
          .setDescription(d.name)
          .setEmoji(CATEGORY_EMOJI[d.category] || '🤖')
      )
    );

  // Row 1: Master Toggles
  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('btn_start_all_agents')
      .setLabel('Start All Agents')
      .setStyle(ButtonStyle.Success)
      .setEmoji('▶️'),
    new ButtonBuilder()
      .setCustomId('btn_pause_all_agents')
      .setLabel('Pause All Agents')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('⏸️'),
    new ButtonBuilder()
      .setCustomId('btn_refresh_dashboard')
      .setLabel('Refresh Status')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('🔄')
  );

  // Row 2: Select Menu
  const row2 = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(agentSelect);

  // Row 3: Quick Action Buttons
  const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('btn_wallet_summary')
      .setLabel('Treasury Wallets')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('🔑'),
    new ButtonBuilder()
      .setCustomId('btn_view_journal')
      .setLabel('Trade Journal')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('📊'),
    new ButtonBuilder()
      .setCustomId('btn_active_alerts')
      .setLabel('Price Alerts')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('🔔'),
    new ButtonBuilder()
      .setCustomId('btn_kill_switch_halt')
      .setLabel('Emergency Halt')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🛑')
  );

  return {
    embeds: [embed],
    components: [row1, row2, row3],
  };
}
