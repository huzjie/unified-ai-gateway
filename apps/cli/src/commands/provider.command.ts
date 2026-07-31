import type { Command } from 'commander';
import { providerAdd } from '../impl/provider/provider-add';
import { providerList } from '../impl/provider/provider-list';
import { providerUpdate } from '../impl/provider/provider-update';
import { providerRemove } from '../impl/provider/provider-remove';
import { providerTest } from '../impl/provider/provider-test';

export function registerProviderCommand(program: Command): void {
  const provider = program.command('provider').description('Provider 管理');
  provider.command('add')
    .description('添加 Provider')
    .requiredOption('--name <name>', '配置名')
    .requiredOption('--type <type>', '类型: openai/moonshot/deepseek/minimax/anthropic/ollama/mock')
    .requiredOption('--base-url <url>', 'Base URL')
    .option('--api-key <key>', 'API Key')
    .option('--models <models>', '模型列表（逗号分隔）')
    .action(providerAdd);
  provider.command('list').description('列出 Providers').action(providerList);
  provider.command('update <id>')
    .description('更新 Provider')
    .option('--base-url <url>', 'Base URL')
    .option('--api-key <key>', 'API Key')
    .option('--enabled <enabled>', 'enabled/disabled')
    .action(providerUpdate);
  provider.command('remove <id>').description('删除 Provider').action(providerRemove);
  provider.command('test <id>').description('连通性测试').action(providerTest);
}
