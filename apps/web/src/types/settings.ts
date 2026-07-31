export interface SystemSettings {
  defaultTimeoutMs: number;
  defaultMaxRetries: number;
  breakerFailureThreshold: number;
  breakerMinRequests: number;
  breakerOpenMs: number;
  globalQps: number;
  globalConcurrency: number;
  webhookUrl: string | null;
  alertRateLimited: boolean;
  alertCircuitOpen: boolean;
  alertQuotaExceeded: boolean;
  logRetentionDays: number;
  cacheEnabled: boolean;
  updatedAt: string;
}
