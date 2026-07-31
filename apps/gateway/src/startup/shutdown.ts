import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * 优雅关闭（SIGTERM/SIGINT）
 */
export async function gracefulShutdown(runtime: RuntimeRegistry): Promise<void> {
  await runtime.shutdown();
}
