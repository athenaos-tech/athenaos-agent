#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const args = process.argv.slice(2);
const subCommand = (args[0] || 'run').toLowerCase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  lime: '\x1b[38;2;204;255;0m',
  pink: '\x1b[38;2;255;183;178m',
  lavender: '\x1b[38;2;214;199;255m',
  cyan: '\x1b[38;2;128;222;234m',
  yellow: '\x1b[38;2;255;245;157m',
  gold: '\x1b[38;2;255;215;0m',
  red: '\x1b[38;2;229;57;53m',
  green: '\x1b[38;2;0;230;118m',
};

console.log(`
${C.lime}${C.bold}       /\\_____/\\
      /  ${C.pink}■${C.lime}   ${C.pink}■${C.lime}  \\      ${C.lime}⚡ ATHENAOS CLI ⚡${C.reset}
${C.lime}     ( ==  ${C.pink}^${C.lime}  == )     ${C.cyan}Autonomous Multi-Agent Trading Desk${C.reset}
${C.lime}      )    ${C.yellow}~${C.lime}    (      ${C.lavender}BNB Smart Chain #56 · PancakeSwap V3${C.reset}
${C.lime}     (   _____   )     ${C.gold}"Five scouts watch. Athena knocks once."${C.reset}
${C.lime}    ( (  )   (  ) )
   (__(__)___(__)__)${C.reset}
`);

function runCommand(command, cmdArgs) {
  const child = spawn(command, cmdArgs, {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}

switch (subCommand) {
  case 'run':
  case 'dev':
  case 'start':
    console.log(`${C.lime}🚀 Launching AthenaOS multi-agent engine...${C.reset}\n`);
    runCommand('npx', ['tsx', 'watch', 'src/index.ts']);
    break;

  case 'onboard':
  case 'wizard':
  case 'setup':
  case 'config':
    console.log(`${C.pink}🧙 Launching Athena onboarding wizard...${C.reset}\n`);
    runCommand('node', ['scripts/wizard.js']);
    break;

  case 'terminal':
  case 'tui':
    console.log(`${C.cyan}⚡ Launching Athena command center TUI...${C.reset}\n`);
    runCommand('npx', ['tsx', 'src/cli/tui.ts']);
    break;

  case 'deploy':
  case 'pm2':
    console.log(`${C.lime}🌐 Deploying Athena 24/7 daemon via PM2...${C.reset}\n`);
    runCommand('npm', ['run', 'deploy']);
    break;

  case 'test':
    console.log(`${C.lavender}🧪 Running AthenaOS test suite...${C.reset}\n`);
    runCommand('npx', ['vitest', 'run']);
    break;

  case 'build':
    console.log(`${C.yellow}⚙️ Compiling TypeScript...${C.reset}\n`);
    runCommand('npx', ['tsc']);
    break;

  case 'update':
    console.log(`${C.cyan}🔄 Pulling latest updates & rebuilding...${C.reset}\n`);
    runCommand('npm', ['run', 'update']);
    break;

  case 'doctor':
  case 'check':
    console.log(`${C.green}🩺 Running Athena diagnostic doctor...${C.reset}\n`);
    runCommand('npx', ['tsx', 'src/cli/doctor.ts']);
    break;

  case 'uninstall':
  case 'purge':
  case 'clean-all':
    console.log(`${C.red}🧹 Launching Athena clean uninstaller...${C.reset}\n`);
    runCommand('node', ['scripts/uninstall.mjs', ...args.slice(1)]);
    break;

  case 'help':
  case '--help':
  case '-h':
  default:
    console.log(`
${C.lime}${C.bold}⚡ ATHENAOS CLI — COMMAND CHEATSHEET:${C.reset}

  ${C.cyan}athena run${C.reset} (or athena)       - Launch the desk engine (dev / live)
  ${C.cyan}athena onboard${C.reset} (or wizard)   - Interactive .env onboarding wizard
  ${C.cyan}athena terminal${C.reset} (or tui)     - Command center terminal UI
  ${C.cyan}athena deploy${C.reset}                - 24/7 PM2 background daemon
  ${C.cyan}athena update${C.reset}                - git pull + install + rebuild + restart
  ${C.cyan}athena doctor${C.reset}                - Health diagnostics
  ${C.cyan}athena test${C.reset}                  - Vitest suite
  ${C.cyan}athena build${C.reset}                 - Compile TypeScript to /dist
  ${C.cyan}athena uninstall${C.reset} (or purge)  - Stop PM2, reset local state
`);
    break;
}
