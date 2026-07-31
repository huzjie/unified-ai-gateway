import type { ISODate, ISODateTime } from '../common/timestamp';

/** 日统计实体（daily_stats 表） */
export interface DailyStats {
  id: number;
  statDate: ISODate;
  keyId: string | null;
  model: string;
  provider: string;
  requestCount: number;
  successCount: number;
  errorCount: number;
  rateLimitedCount: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  /** 成本（元） */
  costAmount: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

/** 统计聚合结果（按维度） */
export interface StatsAggregate {
  dimension: 'model' | 'key' | 'provider' | 'date';
  /** 维度值 */
  key: string;
  requestCount: number;
  successCount: number;
  errorCount: number;
  rateLimitedCount: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  costAmount: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
}

/** 统计查询参数 */
export interface StatsQuery {
  dimension: 'model' | 'key' | 'provider' | 'date';
  startDate?: ISODate;
  endDate?: ISODate;
  tenant?: string;
  model?: string;
  provider?: string;
}
