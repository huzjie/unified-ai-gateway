import type { LogFilter, Page, PageResult, UsageLog } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';

/**
 * 日志查询/详情/保留
 */
export class LogService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 记录请求日志（事件总线 → listener 落库 + 日统计 upsert） */
  recordLog(log: Omit<UsageLog, 'id' | 'createdAt'>): void {
    const full: UsageLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    this.runtime.eventBus.publish('usage_recorded', { log: full }, log.requestId);
    // 同步落库（保证测试可断言）
    this.runtime.repos.usageLog.insert(full);
    this.runtime.repos.dailyStats.upsert({
      statDate: full.createdAt.slice(0, 10),
      keyId: full.keyId,
      model: full.model,
      provider: full.provider,
      requestCount: 1,
      successCount: full.statusCode >= 200 && full.statusCode < 400 ? 1 : 0,
      errorCount: full.statusCode >= 400 ? 1 : 0,
      rateLimitedCount: full.statusCode === 429 ? 1 : 0,
      promptTokens: full.promptTokens,
      completionTokens: full.completionTokens,
      totalTokens: full.totalTokens,
      costAmount: full.costAmount,
      avgLatencyMs: full.latencyMs,
      p95LatencyMs: full.latencyMs,
    });
    this.runtime.eventBus.publish(
      'request_completed',
      { success: full.statusCode >= 200 && full.statusCode < 400, latencyMs: full.latencyMs },
      full.requestId,
    );
  }

  query(filter: LogFilter, page: Page): PageResult<UsageLog> {
    return this.runtime.repos.usageLog.query(filter, page);
  }

  get(id: string): UsageLog {
    const log = this.runtime.repos.usageLog.findById(id);
    if (!log) {
      throw new Error('日志不存在');
    }
    return log;
  }

  /** 保留清理 */
  cleanup(days: number): number {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    return this.runtime.repos.usageLog.deleteOlderThan(cutoff);
  }
}
