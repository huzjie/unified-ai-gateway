import type { RateLimitScope } from '@uag/types';
import { LimiterManager, LimiterFactory, TokenBucket, ConcurrencyLimiter } from '@uag/core';
import type { GatewayConfig } from '@uag/types';

/**
 * 从配置创建限流器组
 */
export class LimiterBootstrap {
  constructor(private readonly config: GatewayConfig) {}

  /** 创建限流管理器 */
  create(): LimiterManager {
    const factory = new LimiterFactory({
      algorithm: this.config.rateLimit.algorithm ?? 'token-bucket',
      windowMs: this.config.rateLimit.windowMs ?? 1000,
    });
    const qpsLimiter = factory.create();
    return new LimiterManager(qpsLimiter, new ConcurrencyLimiter());
  }

  /** 全局限流作用域 */
  globalScope(): RateLimitScope {
    return {
      kind: 'global',
      id: 'global',
      qps: this.config.rateLimit.globalQps,
      burst: this.config.rateLimit.globalBurst ?? this.config.rateLimit.globalQps * 2,
      concurrency: this.config.rateLimit.globalConcurrency,
    };
  }
}

export { TokenBucket, ConcurrencyLimiter };
