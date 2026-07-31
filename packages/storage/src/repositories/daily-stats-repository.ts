import type { DailyStats } from '@uag/types';
import type { SQLiteConnection } from '../connection/sqlite-connection';
import { BaseRepository } from './base-repository';
import type { IDailyStatsRepository } from './interfaces/daily-stats-repository.interface';

interface DailyStatsRow {
  id: number;
  stat_date: string;
  key_id: string | null;
  model: string;
  provider: string;
  request_count: number;
  success_count: number;
  error_count: number;
  rate_limited_count: number;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_amount: number;
  avg_latency_ms: number;
  p95_latency_ms: number;
  created_at: string;
  updated_at: string;
}

function toEntity(row: DailyStatsRow): DailyStats {
  return {
    id: row.id,
    statDate: row.stat_date,
    keyId: row.key_id,
    model: row.model,
    provider: row.provider,
    requestCount: row.request_count,
    successCount: row.success_count,
    errorCount: row.error_count,
    rateLimitedCount: row.rate_limited_count,
    promptTokens: row.prompt_tokens,
    completionTokens: row.completion_tokens,
    totalTokens: row.total_tokens,
    costAmount: row.cost_amount,
    avgLatencyMs: row.avg_latency_ms,
    p95LatencyMs: row.p95_latency_ms,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class DailyStatsRepository extends BaseRepository implements IDailyStatsRepository {
  protected readonly table = 'daily_stats';

  constructor(conn: SQLiteConnection) {
    super(conn);
  }

  /** upsert 单日统计 */
  upsert(stat: Omit<DailyStats, 'id' | 'createdAt' | 'updatedAt'>): void {
    const now = new Date().toISOString();
    this.conn
      .prepare(`
        INSERT INTO daily_stats (
          stat_date, key_id, model, provider, request_count, success_count, error_count,
          rate_limited_count, prompt_tokens, completion_tokens, total_tokens, cost_amount,
          avg_latency_ms, p95_latency_ms, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(stat_date, key_id, model, provider) DO UPDATE SET
          request_count = daily_stats.request_count + excluded.request_count,
          success_count = daily_stats.success_count + excluded.success_count,
          error_count = daily_stats.error_count + excluded.error_count,
          rate_limited_count = daily_stats.rate_limited_count + excluded.rate_limited_count,
          prompt_tokens = daily_stats.prompt_tokens + excluded.prompt_tokens,
          completion_tokens = daily_stats.completion_tokens + excluded.completion_tokens,
          total_tokens = daily_stats.total_tokens + excluded.total_tokens,
          cost_amount = daily_stats.cost_amount + excluded.cost_amount,
          avg_latency_ms = excluded.avg_latency_ms,
          p95_latency_ms = excluded.p95_latency_ms,
          updated_at = excluded.updated_at
      `)
      .run(
        stat.statDate,
        stat.keyId,
        stat.model,
        stat.provider,
        stat.requestCount,
        stat.successCount,
        stat.errorCount,
        stat.rateLimitedCount,
        stat.promptTokens,
        stat.completionTokens,
        stat.totalTokens,
        stat.costAmount,
        stat.avgLatencyMs,
        stat.p95LatencyMs,
        now,
        now,
      );
  }

  /** 从 usage_logs 聚合生成某日统计 */
  aggregateFromLogs(date: string): void {
    const rows = this.conn
      .prepare(`
        SELECT substr(created_at, 1, 10) as stat_date, key_id, model, provider,
          COUNT(*) as request_count,
          SUM(CASE WHEN status_code >= 200 AND status_code < 400 THEN 1 ELSE 0 END) as success_count,
          SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) as error_count,
          SUM(CASE WHEN status_code = 429 THEN 1 ELSE 0 END) as rate_limited_count,
          SUM(prompt_tokens) as prompt_tokens,
          SUM(completion_tokens) as completion_tokens,
          SUM(total_tokens) as total_tokens,
          SUM(cost_amount) as cost_amount,
          AVG(latency_ms) as avg_latency_ms
        FROM usage_logs
        WHERE substr(created_at, 1, 10) = ?
        GROUP BY stat_date, key_id, model, provider
      `)
      .all(date) as Array<Record<string, unknown>>;

    for (const row of rows) {
      this.upsert({
        statDate: row.stat_date as string,
        keyId: row.key_id as string | null,
        model: row.model as string,
        provider: row.provider as string,
        requestCount: Number(row.request_count ?? 0),
        successCount: Number(row.success_count ?? 0),
        errorCount: Number(row.error_count ?? 0),
        rateLimitedCount: Number(row.rate_limited_count ?? 0),
        promptTokens: Number(row.prompt_tokens ?? 0),
        completionTokens: Number(row.completion_tokens ?? 0),
        totalTokens: Number(row.total_tokens ?? 0),
        costAmount: Number(row.cost_amount ?? 0),
        avgLatencyMs: Number(row.avg_latency_ms ?? 0),
        p95LatencyMs: Number(row.avg_latency_ms ?? 0),
      });
    }
  }

  /** 按维度聚合查询 */
  aggregate(_dimension: 'model' | 'key' | 'provider' | 'date', startDate?: string, endDate?: string): DailyStats[] {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (startDate) {
      conditions.push('stat_date >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('stat_date <= ?');
      params.push(endDate);
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const rows = this.conn
      .prepare(`SELECT * FROM daily_stats ${where} ORDER BY stat_date ASC`)
      .all(...params) as DailyStatsRow[];
    return rows.map(toEntity);
  }

  findByDate(date: string): DailyStats[] {
    return this.aggregate('date', date, date);
  }
}
