# ⚡ AthenaOS — BNB Smart Chain Edition

```
       /\_____/\
      /  ■   ■  \       ⚡ ATHENA · BNB SMART CHAIN ⚡
     ( ==  ^  == )      Autonomous Multi-Agent Crypto Intelligence
      )    ~    (       & On-Chain Trading Desk
     (   _____   )      Chain ID 56 · Native BNB · PancakeSwap V3
    ( (  )   (  ) )
   (__(__)___(__)__)
```

**AthenaOS** is an autonomous multi-agent crypto intelligence and trading desk built for **BNB Smart Chain (BSC, chain ID 56, native BNB)**. **Athena** is the desk chief — five scouts report 24/7; she speaks last after **3-Layer Swarm Consensus** clears the gate.

Operate through a **Discord Command Center**, an **Interactive Terminal TUI**, a **Telegram Notification Bridge**, and the optional **[Athena web desk](../binance-app)** (React frontend in this monorepo layout).

Screening and signal generation stay separate from execution: call cards land in Discord with audit data and one-click links; you stay in control via **`DRY_RUN`** (default) and manual confirmation.

[![Chain](https://img.shields.io/badge/BNB%20Smart%20Chain-56%20%7C%20BNB-F0B90B.svg)](https://bscscan.com)
[![DEX](https://img.shields.io/badge/Swap-PancakeSwap%20V3-1FC7D4.svg)](https://pancakeswap.finance)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-blue.svg)](https://nodejs.org/)
[![X (Twitter)](https://img.shields.io/badge/X-%40athenaostech-black.svg)](https://x.com/athenaostech)
[![Node](https://img.shields.io/badge/Node.js-%3E%3D22.12-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> *"Five scouts watch the tape. Athena knocks once — then she stays on the book."* ⚡
>
> ⚠️ **Disclaimer (NFA & DYOR):** AthenaOS is experimental open-source research software. On-chain trading carries significant financial risk. Past performance does not guarantee future results. Not financial advice. Always do your own research.

---

## 🌐 Community & Ecosystem

| Resource | Link |
| :--- | :--- |
| 🐦 **X (Twitter)** | [@athenaostech](https://x.com/athenaostech) |
| 📦 **Agent (this repo)** | [github.com/athenaos-tech/athenaos-agent](https://github.com/athenaos-tech/athenaos-agent.git) |
| 🖥️ **Web desk (frontend)** | [`binance-app/`](../binance-app) — marketing, docs, operator profile, leaderboard |
| 🔑 **Platform API** | Desk keys & public book — configure `ATHENA_PLATFORM_URL` (default [api.athenaos.tech](https://api.athenaos.tech); [athenaos.tech](https://athenaos.tech) rewrites `/platform` there) |

Every operator runs their own agent. The public face is shared; the copy on your book is yours.

---

## ⚡ Athena System Architecture

| Component | Role | What it does |
| :--- | :--- | :--- |
| 🎯 **Athena Core** — Desk chief | Screening & reasoning | **3-Layer Swarm Consensus** (Quant & Liquidity, Catalyst & Sentiment, Security Audit) requiring **≥ 80% confidence** before a knock is posted. Five BSC-focused scouts run 24/7: **BSC Meme Scout** (GMGN smart money + DexScreener 1h tape + launchpad origin, **24h volume ≥ $25k**, **liquidity ≥ $5k**), **BSC LP Scout** (PancakeSwap V3 fee velocity via **Krystal Cloud** on chain `56`, **TVL ≥ $10k**, **24h volume ≥ $100k**, **24h Fee/TVL ≥ 2%**), **BSC NFT Scout** (OpenSea floor & rarity on BSC, **floor surge ≥ +10%/1h**, **volume spike ≥ 1.5x**, **sales ≥ 3/h**), **BSC Narrative Scout** (1-hour BNB rank + optional **X API v2** heat), and **ETH Whale Scout** (Hyperliquid smart money — **perps ≥ $500k**, **spot ≥ $50k**). **Position Manager**: TP **+100% / +200%**, **SL −20%**, trailing stops, LP range warnings, NFT floor alerts. |
| 🎮 **Command Center** — Multi-platform | Discord · Terminal · Telegram | **Discord**: `#athena-control-room` NL chat, audit channel, portfolio & risk, **22 slash commands**, dashboard, five call channels (`#call-meme-robinhood`, `#call-lp-robinhood`, `#call-nft-robinhood`, `#call-alpha-robinhood`, `#call-whale-eth`).<br>**Terminal TUI** (`athena terminal`): live audits, screening triggers, treasury without Discord.<br>**Telegram**: signal cards + inline actions.<br>**Web desk**: optional React UI pointing at this agent’s REST API. |
| 🛠️ **Athena Ops** — Deploy & maintain | Daemon & health | **PM2 24/7** (`athena deploy`), self-update (`athena update`), `athena doctor`, interactive **`athena onboard`** wizard. Platform reporter sends knocks/trades to your desk key when configured. |

> **Note:** Internal domain IDs (e.g. `meme-robinhood`) are legacy identifiers in code and API — user-facing names are **BSC Meme / LP / NFT / Narrative** scouts.

---

## 🗺️ System Flowchart

```
                          USER INTERFACE PLATFORMS
             (Discord Command Center · Terminal TUI · Telegram · Web desk)
                                     │
                                     ▼
                  ┌───────────────────────────────────┐
                  │         ATHENA CORE HUB           │
                  │   control room · chat · risk gate │
                  │   9-lives engine · wallet · journal│
                  └──────────────────┬────────────────┘
                                     │ candidate signals
    ┌────────────────┬───────────────┼───────────────┬────────────────┐
    ▼                ▼               ▼               ▼                ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ BSC MEME     │ │ BSC LP       │ │ BSC NFT      │ │ BSC NARRATIVE│ │ ETH WHALE    │
│ GMGN + tape  │ │ Pancake V3   │ │ OpenSea BSC  │ │ rank + X     │ │ Hyperliquid  │
│ pad origin   │ │ Krystal 56   │ │ floor shocks │ │ 1h alpha     │ │ size & flow  │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       └────────────────┴───────────────┼────────────────┴────────────────┘
                                        ▼
                  ┌────────────────────────────────────┐
                  │   SWARM CONSENSUS ENGINE (≥ 80%)   │
                  │  Quant · Catalyst · Security Audit │
                  └────────────────┬───────────────────┘
                                   │ only high-confidence knocks
                                   ▼
         MULTI-PLATFORM DISPATCH (Discord · TUI · Telegram · REST)
  • Discord call channels (meme · lp · nft · narrative · whale-eth)
  • Terminal: `athena terminal`
  • Telegram: alert cards
  • REST: `/api/calls` for web desk
                                   │
                                   ▼
                       WALLET TRACKER (holdings lifecycle)
                                   │
                                   ▼
                POSITION MANAGER (TP 2x/3x · SL −20% · trailing)
```

---

## 📁 Repository layout (BNB Smart Chain agent)

```
athenaos-agent/                    # clone name; package: binance-agent
├── bin/athena.js                   # CLI entry (`athena` — run, onboard, terminal, deploy, …)
├── src/
│   ├── index.ts                   # Boot: Discord, scouts, API, Telegram
│   ├── config/                    # Env validation, execution mode (DRY_RUN default)
│   ├── orchestrator/              # Hub, swarm consensus, risk, strategies, tool registry
│   │   └── agent-registry.ts      # Five domains → BSC scout display names
│   ├── agents/
│   │   ├── meme-robinhood/        # BSC Meme Scout (GMGN + GoPlus + Dex tape)
│   │   ├── lp-robinhood/          # BSC LP Scout (Krystal → PancakeSwap V3 on 56)
│   │   ├── nft/                   # BSC NFT Scout (OpenSea)
│   │   ├── alpha-robinhood/       # BSC Narrative Scout
│   │   └── whale-eth/             # Hyperliquid ETH whale scout
│   ├── adapters/
│   │   ├── evm-adapter.ts         # Swaps/sends on BSC (#56), PancakeSwap V3 reads
│   │   ├── gmgn-adapter.ts        # Smart money, rank, security
│   │   ├── krystal-cloud-adapter.ts # LP pools chainId=56, protocol=pancakev3
│   │   ├── opensea-adapter.ts     # BSC NFT slugs
│   │   ├── rh-launchpad-adapter.ts # Launchpad / factory origin (eth_call)
│   │   └── dex-flow-adapter.ts    # DexScreener buy/sell pressure
│   ├── discord/                   # Slash commands, embeds, channel bootstrap
│   ├── telegram/                  # Notification bridge
│   ├── api/server.ts              # REST + MCP for web desk
│   ├── cli/                       # Terminal TUI + doctor
│   └── services/                  # Wallet (BSC RPC), platform reporter, audits, AI
├── strategies/                    # Custom screening `.mjs` modules
├── database/                      # Local state (`athena_state.json`, gitignored secrets)
├── scripts/                       # wizard, update-core, uninstall
├── tests/                         # Vitest suite
├── setup.sh / setup.bat           # One-click bootstrap
└── .env.example                   # Copy → `.env`
```

**Companion frontend** ([`binance-app/`](../binance-app)):

```
binance-app/
├── src/           # React pages: Home, Docs, Desk, Launchpad, Leaderboard
├── public/        # Static assets, agent manifest, strategies.json
└── vite.config.ts # Dev proxy to platform API
```

---

## ✨ Feature grid

| # | Feature | Description |
| :-: | :--- | :--- |
| 1 | 🛡️ **3-Layer Swarm Consensus** | Quant & Liquidity, Catalyst & Sentiment, Security Audit — **≥ 80%** before any call card. |
| 2 | 🌸 **BSC Meme Scout** | GMGN + DexScreener 1h tape + launchpad origin; **vol ≥ $25k**, **liq ≥ $5k**, **fees ≥ $250**, GMGN & GoPlus fail-closed. |
| 3 | 🌊 **BSC LP Scout** | PancakeSwap V3 via Krystal (`chainId=56`); **TVL ≥ $10k**, **24h vol ≥ $100k**, **Fee/TVL ≥ 2%**. |
| 4 | 🔮 **BSC NFT Scout** | OpenSea on BSC; floor surge, volume spike, sales velocity gates. |
| 5 | ☀️ **BSC Narrative Scout** | 1h BNB rank + optional X API v2 sentiment. |
| 6 | 🐋 **ETH Whale Scout** | Hyperliquid perps/spot size (cross-venue context; desk execution stays on BSC). |
| 7 | 💬 **Natural-language control room** | Chat with Athena — audits, swaps intent, screening control. |
| 8 | ⚙️ **22 slash commands** | Wallets, screening, charts, journal, `/swap` on PancakeSwap V3, `/send` BNB/BEP-20, and more. |
| 9 | 📈 **Position manager** | TP 2x/3x, SL −20%, trailing, LP/NFT guards. |
| 10 | 🔒 **Security-first** | `DRY_RUN=true` default, 9-lives circuit breaker, sandboxed strategies, API key rotation. |
| 11 | 📡 **REST API** | Feed the web desk: status, calls, positions, executions, agent toggle. |

---

## 🧠 Screening strategies (customizable)

Strictness is set at onboarding (**STEP 5.5**) or in the control room.

- **Loosened default (2×):** More knocks; still gated by **≥ 80%** swarm score.
- **Standard:** Tighter numeric gates (higher vol/TVL/whale thresholds).
- **Custom prompt:** Plain-English rules compiled into a validated `strategies/*.mjs` on first boot.
- **Advanced editor:** Per-scout numeric gates in wizard or chat.

**Loosened defaults:**

| Scout | Hard gates (loosened) |
| :--- | :--- |
| 🌸 **BSC Meme** | 24h vol ≥ $25k · liq ≥ $5k · fees ≥ $250 · security pass |
| 🌊 **BSC LP** | TVL ≥ $10k · 24h vol ≥ $100k · Fee/TVL ≥ 2% · mcap ≥ $100k · security pass |
| 🔮 **BSC NFT** | Floor +10%/1h · vol ≥ 1.5× · ≥ 3 sales/h · security pass |
| 🐋 **Whale ETH** | Perps ≥ $500k · spot ≥ $50k |

Quality floor and security audits are **never** lowered — missing data **fail-closed**.

---

## 🚀 Quickstart

Node.js **≥ 22.12**, TypeScript build. Cross-platform: **Windows**, **Linux**, **macOS**.

### Windows

```powershell
git clone https://github.com/athenaos-tech/athenaos-agent.git
cd athenaos-agent
.\setup.bat
# or: npm install && npm run build && npm run wizard
npm run dev
npm run terminal   # optional TUI
```

### Linux / macOS / VPS

```bash
git clone https://github.com/athenaos-tech/athenaos-agent.git
cd athenaos-agent
bash setup.sh
# or:
npm install && npm run build
athena onboard
athena run
athena terminal
```

### 24/7 daemon

```bash
athena deploy            # PM2: athena-agent
athena update            # pull, install, build, restart + webhook notify
```

> **Discord:** Invite the bot with `applications.commands` + bot scopes. On first launch Athena **auto-creates** the `⚡ ATHENA COMMAND CENTER` category, scout channels, and registers slash commands.

### Optional web desk

```bash
cd ../binance-app
cp .env.example .env
npm install && npm run dev
# http://127.0.0.1:5173 — set VITE_ATHENA_API_URL to your agent REST URL if needed
```

---

## ⌨️ CLI (`athena`)

| Command | Aliases | Description |
| :--- | :--- | :--- |
| `athena run` | `dev`, `start` | Launch the desk engine |
| `athena onboard` | `wizard`, `setup` | Interactive `.env` wizard |
| `athena terminal` | `tui` | Terminal command center |
| `athena deploy` | `pm2` | PM2 background daemon |
| `athena test` | — | Vitest suite |
| `athena build` | — | Compile to `dist/` |
| `athena update` | — | Self-update + restart |
| `athena doctor` | `check` | Diagnostics |
| `athena uninstall` | `purge` | Stop PM2, wipe local state |

Fallback: `npm run dev`, `node bin/athena.js <command>`.

---

## 🤖 Discord slash commands (22)

Restricted to channels under **`⚡ ATHENA COMMAND CENTER`**.

| Command | Description |
| :--- | :--- |
| `/wallet` | Burner wallets: setup, list, balance, withdraw |
| `/analyze` | On-demand 3-layer token audit (BSC contract) |
| `/screening` | Start/stop/status/trigger scouts |
| `/swap` | Swap via **PancakeSwap V3** on BNB Chain |
| `/send` | Send BNB or BEP-20 |
| `/pump` | BSC momentum, holders, liquidity |
| `/journal` | Trade journal + CSV export |
| `/menu`, `/dashboard` | Control center UI |
| … | See in-bot `/help` and `src/discord/commands/index.ts` |

---

## 📢 Auto-created Discord channels (7)

| Channel | Purpose |
| :--- | :--- |
| `#athena-control-room` | Command hub — chat, wallets, risk |
| `#athena-audit` | Paste any **BSC** contract for instant audit |
| `#call-meme-robinhood` | **BSC Meme Scout** knocks |
| `#call-lp-robinhood` | **BSC LP Scout** knocks |
| `#call-nft-robinhood` | **BSC NFT Scout** knocks |
| `#call-alpha-robinhood` | **BSC Narrative Scout** knocks |
| `#call-whale-eth` | Hyperliquid whale flow |

Call cards link to **PancakeSwap**, **DexScreener (bsc)**, **Krystal**, **OpenSea**, **BscScan** — no auto-buy buttons by default.

---

## 🔐 Environment variables

Copy `.env.example` → `.env`. Backup keys: `*_BACKUP_KEYS` (comma-separated) rotate on 401/403/429.

| Variable | Description |
| :--- | :--- |
| `DRY_RUN` | `true` (default) = no live txs |
| `AUTO_EXECUTE_ENABLED` | Default `false` — manual execution via links/`/swap` |
| `DISCORD_BOT_TOKEN` / `DISCORD_CLIENT_ID` | Discord bot |
| `DISCORD_CHANNEL_CONTROL_ROOM` | Control room channel ID |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Telegram bridge |
| `BSC_RPC_URL` | **Primary BSC RPC** (fallback: `https://bsc-dataseed.binance.org`) |
| `EVM_RPC_URL` / `RPC_FAILOVER_URLS` | Generic EVM failover pool (`{"evm":["…"]}`) |
| `AI_PROVIDER` / `AI_API_KEYS` / `AI_MODEL_NAME` | LLM with failover |
| `GMGN_API_KEY` | Smart money, rank, security |
| `KRYSTAL_CLOUD_API_KEY` | PancakeSwap V3 LP on chain **56** |
| `OPENSEA_API_KEY` | BSC NFT |
| `X_API_BEARER_TOKEN` | Narrative scout (optional social) |
| `GOPLUS_API_KEY` | Token security on BSC |
| `EVM_PRIVATE_KEY` | Desk wallet — keep `DRY_RUN=true` while testing |
| `API_PORT` / `ATHENA_API_KEY` | REST API (default port `3000`) |
| `ATHENA_DESK_KEY` / `ATHENA_PLATFORM_URL` | Report knocks & trades to Athena platform leaderboard |

---

## 📡 REST API (web desk integration)

Optional `ATHENA_API_KEY` header. CORS enabled for local frontends.

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/status`, `/health` | GET | Mode, scouts, risk, connectivity |
| `/api/calls` | GET | Historical knocks (`?domain=meme-robinhood&limit=50`) |
| `/api/positions` | GET | Open positions + PnL |
| `/api/executions` | GET | Journal / stats |
| `/api/alerts` | GET | Price alerts |
| `/api/agents/toggle` | POST | Pause/resume a scout |
| `/api/command` | POST | Tool registry actions |

---

## ❓ FAQ

**What chain does Athena trade?**  
**BNB Smart Chain only** for execution — chain ID **56**, native **BNB**, explorer [bscscan.com](https://bscscan.com). Swaps read **PancakeSwap V3** liquidity. Launches and pad origin tie into BSC factory detection; platform token launches are documented on the web desk (**flap.sh**).

**What is AthenaOS?**  
Open-source, self-hosted multi-agent desk: five scouts + swarm consensus + Discord/TUI/Telegram + REST. **Athena** is the persona and desk chief in chat.

**Is `DRY_RUN` safe?**  
Yes. Default **`DRY_RUN=true`** simulates swaps/sends; only explicit opt-in enables live signing.

**Where are keys stored?**  
Local `.env` and gitignored `database/athena_state.json`. Nothing is uploaded unless you configure platform reporting.

---

## ⚠️ Risk disclaimer

> **NOT FINANCIAL ADVICE.** Experimental software. Memecoins, LP, and NFTs are volatile. **`DRY_RUN` is default** — you can still lose funds if you enable live mode. Trade only what you can afford to lose. DYOR.

---

## 📜 License

MIT — see [LICENSE](LICENSE).

---

*Built for BNB Smart Chain — precision screening, nine lives on risk, one knock at a time.* ⚡ **AthenaOS** · [@athenaostech](https://x.com/athenaostech)
