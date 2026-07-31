import type { HealthStatus, ProviderAdapter } from '@uag/types';

/**
 * 定时/手动健康检查
 */
export class HealthChecker {
  private timers = new Map<string, ReturnType<typeof setInterval>>();

  /** 手动检查单个 Provider */
  async check(adapter: ProviderAdapter): Promise<HealthStatus> {
    try {
      return await adapter.healthCheck();
    } catch {
      return 'unhealthy';
    }
  }

  /** 检查全部 */
  async checkAll(adapters: ProviderAdapter[]): Promise<Array<{ name: string; status: HealthStatus }>> {
    const results: Array<{ name: string; status: HealthStatus }> = [];
    for (const adapter of adapters) {
      results.push({ name: adapter.name, status: await this.check(adapter) });
    }
    return results;
  }

  /** 定时检查（返回取消函数） */
  startInterval(
    adapter: ProviderAdapter,
    intervalMs: number,
    onResult: (name: string, status: HealthStatus) => void,
  ): () => void {
    const timer = setInterval(async () => {
      const status = await this.check(adapter);
      onResult(adapter.name, status);
    }, intervalMs);
    this.timers.set(adapter.name, timer);
    return () => {
      const t = this.timers.get(adapter.name);
      if (t) {
        clearInterval(t);
        this.timers.delete(adapter.name);
      }
    };
  }

  /** 停止全部定时器 */
  stopAll(): void {
    for (const timer of this.timers.values()) {
      clearInterval(timer);
    }
    this.timers.clear();
  }
}
