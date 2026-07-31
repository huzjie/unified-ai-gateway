import type { Command } from 'commander';

export function registerServeCommand(program: Command): void {
  program.command('serve')
    .description('本地启动网关（dev 模式，需 @uag/gateway 依赖）')
    .option('--port <port>', '端口', '8787')
    .action(async () => {
      const { output } = await import('../utils/output');
      output.info('请使用根目录 npm run dev 启动网关服务');
    });
}
