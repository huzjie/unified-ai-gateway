import type { Command } from 'commander';

export function registerHealthCommand(program: Command): void {
  program.command('health')
    .description('健康检查')
    .action(async () => {
      const { httpClient } = await import('../utils/http-client');
      const res = await httpClient.get('/healthz');
      const { output } = await import('../utils/output');
      output.json(res.data);
    });
}
