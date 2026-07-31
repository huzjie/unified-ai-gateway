export interface StatsAggregate {
  dimension: string;
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

export interface HourlyTrend {
  hour: string;
  requests: number;
  errors: number;
}
