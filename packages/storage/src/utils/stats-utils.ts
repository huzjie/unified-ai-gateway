/**
 * 聚合统计 SQL 生成
 */
export type StatsDimension = 'model' | 'key' | 'provider' | 'date';

export class StatsUtils {
  /** 维度 → 列 */
  static dimensionColumn(dimension: StatsDimension): string {
    switch (dimension) {
      case 'model':
        return 'model';
      case 'key':
        return 'key_id';
      case 'provider':
        return 'provider';
      case 'date':
        return 'stat_date';
      default:
        return 'model';
    }
  }

  /** 聚合 SQL（daily_stats 表） */
  static aggregateSql(dimension: StatsDimension, where = '', extra = ''): string {
    const col = StatsUtils.dimensionColumn(dimension);
    return `
      SELECT ${col} as dim_key,
        COUNT(*) as request_count,
        SUM(success_count) as success_count,
        SUM(error_count) as error_count,
        SUM(rate_limited_count) as rate_limited_count,
        SUM(prompt_tokens) as prompt_tokens,
        SUM(completion_tokens) as completion_tokens,
        SUM(total_tokens) as total_tokens,
        SUM(cost_amount) as cost_amount,
        AVG(avg_latency_ms) as avg_latency_ms,
        MAX(p95_latency_ms) as p95_latency_ms
      FROM daily_stats
      ${where}
      GROUP BY ${col}
      ${extra}
    `;
  }
}
