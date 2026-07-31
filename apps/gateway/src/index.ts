import { buildServer } from './server';
import { bootstrap } from './startup/bootstrap';

/**
 * 进程入口（启动/优雅退出）
 */
async function main(): Promise<void> {
  const runtime = await bootstrap();
  const server = buildServer(runtime);

  try {
    await server.listen({
      port: runtime.config.server.port,
      host: runtime.config.server.host,
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }

  // 优雅退出
  const shutdown = async (signal: string): Promise<void> => {
    server.log.info({ signal }, 'shutting down');
    await runtime.shutdown();
    await server.close();
    process.exit(0);
  };
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

void main();
