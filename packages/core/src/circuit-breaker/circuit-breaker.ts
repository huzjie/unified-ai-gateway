import type { BreakerDecision, BreakerState } from '@uag/types';

export type { BreakerDecision, BreakerState } from '@uag/types';

/**
 * 熔断器接口
 */
export interface CircuitBreaker {
  /** 请求前询问是否放行 */
  allow(providerKey: string): BreakerDecision;
  /** 记录成功 */
  recordSuccess(providerKey: string): void;
  /** 记录失败 */
  recordFailure(providerKey: string, error?: Error): void;
  /** 获取状态 */
  getState(providerKey: string): BreakerState;
  /** 重置 */
  reset(providerKey: string): void;
}
