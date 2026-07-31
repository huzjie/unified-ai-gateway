import type { RateLimitAlgorithm } from '@uag/types';
import type { RateLimiter } from './rate-limiter';
import { TokenBucket } from './token-bucket';
import { FixedWindow } from './fixed-window';
import { SlidingWindow } from './sliding-window';
import { MemoryStore } from './memory-store';

/** 限流器工厂配置 */
export interface LimiterFactoryConfig {
  algorithm: RateLimitAlgorithm;
  windowMs: number;
}

/**
 * 按配置创建限流器
 */
export class LimiterFactory {
  constructor(private readonly config: LimiterFactoryConfig) {}

  create(): RateLimiter {
    switch (this.config.algorithm) {
      case 'token-bucket':
        return new TokenBucket(new MemoryStore());
      case 'fixed-window':
        return new FixedWindow(this.config.windowMs, new MemoryStore());
      case 'sliding-window':
        return new SlidingWindow(this.config.windowMs, new MemoryStore());
      default:
        return new TokenBucket(new MemoryStore());
    }
  }

  /** 默认配置 */
  static default(): LimiterFactory {
    return new LimiterFactory({ algorithm: 'token-bucket', windowMs: 1000 });
  }
}
