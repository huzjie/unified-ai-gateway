export interface DashboardData {
  range: { start: string; end: string };
  metrics: {
    totalRequests: number;
    todayRequests: number;
    todayCost: number;
    successRate: number;
    avgLatencyMs: number;
    p95LatencyMs: number;
    circuitOpenCount: number;
    rateLimitedCount: number;
  };
  trend: Array<{ hour: string; requests: number; errors: number }>;
  modelShare: Array<{ model: string; requests: number; percent: number }>;
  costTopKeys: Array<{ keyId: string; keyPrefix: string; tenant: string; requests: number; cost: number }>;
  daily: Array<{ date: string; requests: number; cost: number; successRate: number }>;
}
