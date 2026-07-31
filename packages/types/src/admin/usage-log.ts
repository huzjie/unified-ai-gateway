import type { ISODateTime } from '../common/timestamp';

/** 请求日志实体（usage_logs 表） */
export interface UsageLog {
  id: string;
  requestId: string;
  keyId: string | null;
  tenant: string;
  model: string;
  provider: string;
  providerModel: string;
  statusCode: number;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  /** 成本金额（微元） */
  costAmount: number;
  currency: string;
  stream: boolean;
  cacheHit: boolean;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: ISODateTime;
}

/** 日志查询过滤 */
export interface LogFilter {
  keyId?: string;
  tenant?: string;
  model?: string;
  provider?: string;
  statusCode?: number;
  stream?: boolean;
  cacheHit?: boolean;
  startTime?: ISODateTime;
  endTime?: ISODateTime;
  search?: string;
}
