import type { Command } from 'commander';

export function registerAliasCommand(program: Command): void {
  const alias = program.command('alias').description('模型别名管理（P1）');
  alias.command('list')
    .description('列出别名')
    .action(async () => {
      const { output } = await import('../utils/output');
      output.json({ note: '别名通过配置文件管理' });
    });
}
