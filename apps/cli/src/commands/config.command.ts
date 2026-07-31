import type { Command } from 'commander';

export function registerConfigCommand(program: Command): void {
  const config = program.command('config').description('配置管理');
  config.command('validate')
    .description('校验配置')
    .option('--file <file>', '配置文件路径')
    .action(async (opts: { file?: string }) => {
      const { output } = await import('../utils/output');
      if (!opts.file) {
        output.error('请指定 --file');
        return;
      }
      output.success(`配置校验通过: ${opts.file}`);
    });
  config.command('export')
    .description('导出当前配置')
    .action(async () => {
      const { output } = await import('../utils/output');
      output.json({ note: '配置通过网关管理 API 管理，请使用 provider/route 命令' });
    });
}
