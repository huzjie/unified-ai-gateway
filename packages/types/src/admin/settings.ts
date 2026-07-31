import type { ISODateTime } from '../common/timestamp';

/** 系统设置（KV 存储） */
export interface SystemSettings {
  /** 全局默认超时（ms） */
  defaultTimeoutMs: number;
  /** 默认重试次数 */
  defaultMaxRetries: number;
  /** 熔断失败阈值 */
  breakerFailureThreshold: number;
  /** 熔断最小请求数 */
  breakerMinRequests: number;
  /** 熔断打开时长（ms） */
  breakerOpenMs: number;
  /** 全局 QPS */
  globalQps: number;
  /** 全局并发 */
  globalConcurrency: number;
  /** 告警 Webhook URL */
  webhookUrl: string | null;
  /** 告警开关：限流 */
  alertRateLimited: boolean;
  /** 告警开关：熔断 */
  alertCircuitOpen: boolean;
  /** 告警开关：配额 */
  alertQuotaExceeded: boolean;
  /** 日志保留天数 */
  logRetentionDays: number;
  /** 是否启用上下文缓存 */
  cacheEnabled: boolean;
  updatedAt: ISODateTime;
}

/** 设置更新补丁（部分字段） */
export type SettingsPatch = Partial<Omit<SystemSettings, 'updatedAt'>>;

/** 默认系统设置 */
export const DEFAULT_SETTINGS: Omit<SystemSettings, 'updatedAt'> = {
  defaultTimeoutMs: 30000,
  defaultMaxRetries: 2,
  breakerFailureThreshold: 0.5,
  breakerMinRequests: 10,
  breakerOpenMs: 30000,
  globalQps: 1000,
  globalConcurrency: 200,
  webhookUrl: null,
  alertRateLimited: false,
  alertCircuitOpen: false,
  alertQuotaExceeded: false,
  logRetentionDays: 30,
  cacheEnabled: false,
};
