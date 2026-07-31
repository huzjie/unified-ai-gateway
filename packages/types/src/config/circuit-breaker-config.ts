import type { BreakerState } from '../common/status';

/** 熔断配置（字段均可选，实现层用默认值兜底） */
export interface CircuitBreakerConfig {
  /** 失败率阈值（默认 0.5） */
  failureThreshold?: number;
  /** 触发判定最小请求数（默认 10） */
  minRequests?: number;
  /** 打开时长（ms，默认 30000） */
  openMs?: number;
  /** 半开探测放行比例（默认 0.5） */
  halfOpenRatio?: number;
  /** 连续失败次数触发（可选，0 = 不启用） */
  consecutiveFailures?: number;
}

/** 熔断决策 */
export interface BreakerDecision {
  allowed: boolean;
  state: BreakerState;
  /** OPEN 时熔断剩余时间（ms） */
  retryAfterMs?: number;
}

/** 熔断状态快照 */
export interface BreakerStateSnapshot {
  providerKey: string;
  state: BreakerState;
  failureCount: number;
  successCount: number;
  totalCount: number;
  failureRate: number;
  openedAt: number | null;
  lastFailureAt: number | null;
  nextAttemptAt: number | null;
}
