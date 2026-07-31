import type { Command } from 'commander';

export function registerAuditCommand(program: Command): void {
  program.command('audit')
    .description('查询审计日志')
    .option('--limit <n>', '条数', '20')
    .action(async () => {
      const { auditSearch } = await import('../impl/audit-search');
      await auditSearch();
    });
}
