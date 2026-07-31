import type { Command } from 'commander';

export function registerExportCommand(program: Command): void {
  program.command('export')
    .description('导出用量报表 CSV')
    .option('--start <iso>', '开始时间')
    .option('--end <iso>', '结束时间')
    .action(async (opts: { start?: string; end?: string }) => {
      const { exportCsv } = await import('../impl/export-csv');
      await exportCsv(opts.start, opts.end);
    });
}
