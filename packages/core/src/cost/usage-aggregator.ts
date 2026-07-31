import type { StatsAggregate, UsageLog } from '@uag/types';
import { alignToDay, alignToHour } from '../utils/time';

/**
 * 用量聚合器：按模型/Key/时间聚合
 * 纯函数聚合，不依赖存储实现。
 */
export class UsageAggregator {
  /** 按模型聚合 */
  byModel(logs: UsageLog[]): StatsAggregate[] {
    return this.aggregate(logs, (log) => log.model);
  }

  /** 按 Key 聚合 */
  byKey(logs: UsageLog[]): StatsAggregate[] {
    return this.aggregate(logs, (log) => log.keyId ?? 'unknown');
  }

  /** 按 Provider 聚合 */
  byProvider(logs: UsageLog[]): StatsAggregate[] {
    return this.aggregate(logs, (log) => log.provider);
  }

  /** 按日聚合 */
  byDate(logs: UsageLog[]): StatsAggregate[] {
    return this.aggregate(logs, (log) => alignToDay(log.createdAt));
  }

  /** 按小时聚合 */
  byHour(logs: UsageLog[]): StatsAggregate[] {
    return this.aggregate(logs, (log) => alignToHour(log.createdAt));
  }

  /** 通用聚合 */
  aggregate(logs: UsageLog[], keyFn: (log: UsageLog) => string): StatsAggregate[] {
    const map = new Map<string, StatsAggregate>();
    for (const log of logs) {
      const key = keyFn(log);
      const current = map.get(key) ?? {
        dimension: 'model',
        key,
        requestCount: 0,
        successCount: 0,
        errorCount: 0,
        rateLimitedCount: 0,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        costAmount: 0,
        avgLatencyMs: 0,
        p95LatencyMs: 0,
      };
      current.requestCount += 1;
      if (log.statusCode >= 200 && log.statusCode < 400) {
        current.successCount += 1;
      } else {
        current.errorCount += 1;
      }
      if (log.statusCode === 429) {
        current.rateLimitedCount += 1;
      }
      current.promptTokens += log.promptTokens;
      current.completionTokens += log.completionTokens;
      current.totalTokens += log.totalTokens;
      current.costAmount += log.costAmount;
      current.avgLatencyMs += log.latencyMs;
      map.set(key, current);
    }

    const results = [...map.values()];
    for (const r of results) {
      if (r.requestCount > 0) {
        r.avgLatencyMs = Number((r.avgLatencyMs / r.requestCount).toFixed(1));
      }
      // P95 简化为均值（完整 P95 需要保留延迟样本，存储层实现）
      r.p95LatencyMs = r.avgLatencyMs;
    }
    return results;
  }
}
