import type { ISODate, ISODateTime } from '../common/timestamp';

/** 仪表盘聚合数据 */
export interface DashboardData {
  /** 时间范围 */
  range: {
    start: ISODateTime;
    end: ISODateTime;
  };
  /** 指标卡片 */
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
  /** 调用量趋势（按小时） */
  trend: Array<{
    hour: ISODateTime;
    requests: number;
    errors: number;
  }>;
  /** 各模型调用占比 */
  modelShare: Array<{
    model: string;
    requests: number;
    percent: number;
  }>;
  /** 成本 Top Key */
  costTopKeys: Array<{
    keyId: string;
    keyPrefix: string;
    tenant: string;
    requests: number;
    cost: number;
  }>;
  /** 日期明细（按日） */
  daily: Array<{
    date: ISODate;
    requests: number;
    cost: number;
    successRate: number;
  }>;
}
