import type { LogFilter, StatsAggregate } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';
import { UsageAggregator } from '@uag/core';

/**
 * 统计聚合查询
 */
export class StatsService {
  private readonly aggregator = new UsageAggregator();

  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 按维度聚合 */
  aggregate(dimension: 'model' | 'key' | 'provider' | 'date', filter: LogFilter = {}): StatsAggregate[] {
    const logs = this.runtime.repos.usageLog.queryRange(filter);
    switch (dimension) {
      case 'model':
        return this.aggregator.byModel(logs);
      case 'key':
        return this.aggregator.byKey(logs);
      case 'provider':
        return this.aggregator.byProvider(logs);
      case 'date':
        return this.aggregator.byDate(logs);
      default:
        return [];
    }
  }

  /** 按小时趋势 */
  hourly(filter: LogFilter = {}): Array<{ hour: string; requests: number; errors: number }> {
    const logs = this.runtime.repos.usageLog.queryRange(filter);
    const map = new Map<string, { requests: number; errors: number }>();
    for (const log of logs) {
      const hour = log.createdAt.slice(0, 13) + ':00';
      const current = map.get(hour) ?? { requests: 0, errors: 0 };
      current.requests += 1;
      if (log.statusCode >= 400) {
        current.errors += 1;
      }
      map.set(hour, current);
    }
    return [...map.entries()]
      .map(([hour, v]) => ({ hour, ...v }))
      .sort((a, b) => a.hour.localeCompare(b.hour));
  }
}
