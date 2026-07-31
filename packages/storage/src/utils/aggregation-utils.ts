import type { UsageLog } from '@uag/types';

/**
 * 多维聚合（model/key/date）
 * 纯函数内存聚合，供 CSV 导出与统计服务使用。
 */
export class AggregationUtils {
  /** 按维度聚合 logs */
  aggregate(logs: UsageLog[], dimension: 'model' | 'key' | 'provider' | 'date'): Array<Record<string, unknown>> {
    const map = new Map<string, Record<string, unknown>>();
    for (const log of logs) {
      const key = this.dimValue(log, dimension);
      const current = map.get(key) ?? {
        dimension: key,
        request_count: 0,
        success_count: 0,
        error_count: 0,
        rate_limited_count: 0,
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        cost_amount: 0,
        latency_sum: 0,
      };
      current.request_count = (current.request_count as number) + 1;
      if (log.statusCode >= 200 && log.statusCode < 400) {
        current.success_count = (current.success_count as number) + 1;
      } else {
        current.error_count = (current.error_count as number) + 1;
      }
      if (log.statusCode === 429) {
        current.rate_limited_count = (current.rate_limited_count as number) + 1;
      }
      current.prompt_tokens = (current.prompt_tokens as number) + log.promptTokens;
      current.completion_tokens = (current.completion_tokens as number) + log.completionTokens;
      current.total_tokens = (current.total_tokens as number) + log.totalTokens;
      current.cost_amount = (current.cost_amount as number) + log.costAmount;
      current.latency_sum = (current.latency_sum as number) + log.latencyMs;
      map.set(key, current);
    }
    return [...map.values()].map((r) => ({
      ...r,
      avg_latency_ms: (r.latency_sum as number) / (r.request_count as number),
    }));
  }

  private dimValue(log: UsageLog, dimension: string): string {
    switch (dimension) {
      case 'model':
        return log.model;
      case 'key':
        return log.keyId ?? 'unknown';
      case 'provider':
        return log.provider;
      case 'date':
        return log.createdAt.slice(0, 10);
      default:
        return log.model;
    }
  }
}
