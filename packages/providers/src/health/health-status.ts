import type { HealthStatus } from '@uag/types';

/**
 * 健康状态聚合
 */
export class HealthStatusAggregator {
  /** 汇总状态：全部 healthy → healthy；任一 unhealthy → unhealthy；否则 unknown */
  aggregate(statuses: HealthStatus[]): HealthStatus {
    if (statuses.length === 0) {
      return 'unknown';
    }
    if (statuses.every((s) => s === 'healthy')) {
      return 'healthy';
    }
    if (statuses.some((s) => s === 'unhealthy')) {
      return 'unhealthy';
    }
    return 'unknown';
  }

  /** 统计分布 */
  summarize(statuses: HealthStatus[]): { healthy: number; unhealthy: number; unknown: number } {
    return {
      healthy: statuses.filter((s) => s === 'healthy').length,
      unhealthy: statuses.filter((s) => s === 'unhealthy').length,
      unknown: statuses.filter((s) => s === 'unknown' || s === 'checking').length,
    };
  }
}
