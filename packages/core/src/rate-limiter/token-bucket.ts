import type { RateLimitResult, RateLimitScope } from '@uag/types';
import type { RateLimiter } from './rate-limiter';
import { MemoryStore } from './memory-store';

/**
 * 令牌桶实现
 * 每 scope 一个桶：容量 burst，以 qps 速率补充令牌。
 */
export class TokenBucket implements RateLimiter {
  readonly name = 'token-bucket';

  private readonly buckets = new Map<string, { tokens: number; lastRefill: number }>();

  constructor(_store: MemoryStore = new MemoryStore()) {}

  check(scope: RateLimitScope, weight = 1): RateLimitResult {
    const key = `${scope.kind}:${scope.id}`;
    const capacity = scope.burst ?? scope.qps;
    const now = Date.now();
    let bucket = this.buckets.get(key);
    if (!bucket) {
      bucket = { tokens: capacity, lastRefill: now };
      this.buckets.set(key, bucket);
    }

    // 补充令牌：elapsedMs / 1000 * qps
    const elapsedMs = now - bucket.lastRefill;
    if (elapsedMs > 0) {
      const refill = (elapsedMs / 1000) * scope.qps;
      bucket.tokens = Math.min(capacity, bucket.tokens + refill);
      bucket.lastRefill = now;
    }

    if (bucket.tokens >= weight) {
      bucket.tokens -= weight;
      return {
        allowed: true,
        retryAfterMs: 0,
        remaining: Math.floor(bucket.tokens),
        limit: scope.qps,
        limitType: 'qps',
      };
    }

    // 计算下一次可用的等待时间
    const deficit = weight - bucket.tokens;
    const retryAfterMs = Math.ceil((deficit / scope.qps) * 1000);
    return {
      allowed: false,
      retryAfterMs,
      remaining: 0,
      limit: scope.qps,
      limitType: 'qps',
    };
  }

  async acquire(): Promise<RateLimitResult> {
    return { allowed: true, retryAfterMs: 0, remaining: 0, limit: 0, limitType: 'qps' };
  }

  release(): void {
    // token-bucket 无并发槽
  }

  reset(scope: RateLimitScope): void {
    this.buckets.delete(`${scope.kind}:${scope.id}`);
  }

  /** 测试辅助：清空全部桶 */
  clear(): void {
    this.buckets.clear();
  }
}
