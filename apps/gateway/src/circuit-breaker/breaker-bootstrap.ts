import { BreakerRegistry } from '@uag/core';
import type { GatewayConfig } from '@uag/types';

/**
 * 熔断器装配层
 */
export class BreakerBootstrap {
  constructor(private readonly config: GatewayConfig) {}

  /** 创建熔断注册表 */
  create(): BreakerRegistry {
    return new BreakerRegistry({
      failureThreshold: this.config.circuitBreaker.failureThreshold,
      minRequests: this.config.circuitBreaker.minRequests,
      openMs: this.config.circuitBreaker.openMs,
      halfOpenRatio: this.config.circuitBreaker.halfOpenRatio ?? 0.5,
    });
  }
}
