import type { Command } from 'commander';

export function registerVersionCommand(program: Command): void {
  program.command('version')
    .description('版本信息')
    .action(async () => {
      const { output } = await import('../utils/output');
      output.json({ name: 'unified-ai-gateway', version: '1.0.0' });
    });
}
