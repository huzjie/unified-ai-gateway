/**
 * 事件名与事件载荷类型
 * 事件总线：核心无副作用，审计/用量/告警通过 listener 落库/推送。
 */
export type GatewayEventType =
  | 'request_started'
  | 'request_completed'
  | 'usage_recorded'
  | 'rate_limited'
  | 'circuit_opened'
  | 'circuit_closed'
  | 'circuit_half_open'
  | 'provider_failed'
  | 'provider_recovered'
  | 'audit_logged'
  | 'quota_exceeded'
  | 'cache_hit'
  | 'cache_miss';

/** 事件载荷 */
export interface GatewayEvent<T = unknown> {
  /** 事件类型 */
  type: GatewayEventType;
  /** 事件 ID */
  id: string;
  /** 产生时间（ISO8601） */
  timestamp: string;
  /** 关联请求 ID */
  requestId?: string;
  /** 载荷 */
  payload: T;
}

/** usage_recorded 载荷 */
export interface UsageRecordedEventPayload {
  log: import('../admin/usage-log').UsageLog;
}

/** rate_limited 载荷 */
export interface RateLimitedEventPayload {
  requestId: string;
  scope: string;
  limitType: 'qps' | 'concurrency';
  retryAfterMs: number;
  keyId?: string;
  tenant?: string;
}

/** circuit_opened 载荷 */
export interface CircuitOpenedEventPayload {
  providerKey: string;
  failureRate: number;
  failureCount: number;
}

/** provider_failed 载荷 */
export interface ProviderFailedEventPayload {
  providerKey: string;
  model: string;
  errorCode: string;
  errorMessage: string;
  retryable: boolean;
  requestId?: string;
}

/** audit_logged 载荷 */
export interface AuditLoggedEventPayload {
  log: import('../admin/audit-log').AuditLog;
}

/** quota_exceeded 载荷 */
export interface QuotaExceededEventPayload {
  tenant: string;
  period: string;
  limit: number;
  used: number;
}
