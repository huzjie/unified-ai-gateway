import { Command } from 'commander';
import { registerKeyCommand } from './commands/key.command';
import { registerProviderCommand } from './commands/provider.command';
import { registerRouteCommand } from './commands/route.command';
import { registerStatsCommand } from './commands/stats.command';
import { registerLogCommand } from './commands/log.command';
import { registerServeCommand } from './commands/serve.command';
import { registerConfigCommand } from './commands/config.command';
import { registerAliasCommand } from './commands/alias.command';
import { registerAuditCommand } from './commands/audit.command';
import { registerExportCommand } from './commands/export.command';
import { registerHealthCommand } from './commands/health.command';
import { registerVersionCommand } from './commands/version.command';

/**
 * commander 解析与命令注册
 */
export async function runCli(argv: string[]): Promise<void> {
  const program = new Command();
  program
    .name('gateway-cli')
    .description('Unified AI Gateway 命令行管理工具')
    .version('1.0.0')
    .option('--json', '以 JSON 格式输出（可脚本化）')
    .option('--api-url <url>', '网关管理 API 地址', 'http://localhost:8787')
    .option('--token <token>', '管理 JWT（或使用 GATEWAY_CLI_TOKEN 环境变量）');

  registerKeyCommand(program);
  registerProviderCommand(program);
  registerRouteCommand(program);
  registerStatsCommand(program);
  registerLogCommand(program);
  registerServeCommand(program);
  registerConfigCommand(program);
  registerAliasCommand(program);
  registerAuditCommand(program);
  registerExportCommand(program);
  registerHealthCommand(program);
  registerVersionCommand(program);

  await program.parseAsync(argv);
}
