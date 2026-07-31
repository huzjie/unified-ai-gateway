import type { BreakerState, BreakerStateSnapshot, CircuitBreakerConfig } from '@uag/types';
import type { CircuitBreaker } from './circuit-breaker';
import { Breaker } from './breaker-registry';

/**
 * 熔断器工厂
 */
export class BreakerFactory {
  constructor(private readonly defaultConfig: CircuitBreakerConfig = {}) {}

  /** 创建单个熔断器 */
  create(config?: CircuitBreakerConfig): CircuitBreaker {
    return new Breaker({ ...this.defaultConfig, ...config });
  }

  /** 创建默认配置熔断器 */
  static default(): BreakerFactory {
    return new BreakerFactory({
      failureThreshold: 0.5,
      minRequests: 10,
      openMs: 30_000,
      halfOpenRatio: 0.5,
    });
  }
}

export type { BreakerState, BreakerStateSnapshot };
