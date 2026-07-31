import type { RateLimitResult, RateLimitScope } from '@uag/types';
import type { RateLimiter } from './rate-limiter';
import { MemoryStore } from './memory-store';

/**
 * 滑动窗口实现（计数）
 * 保留窗口内每个请求的时间戳，精确统计窗口内请求数。
 */
export class SlidingWindow implements RateLimiter {
  readonly name = 'sliding-window';

  constructor(
    private readonly windowMs: number,
    private readonly store: MemoryStore = new MemoryStore(),
  ) {}

  check(scope: RateLimitScope, weight = 1): RateLimitResult {
    const key = `${scope.kind}:${scope.id}`;
    const now = Date.now();
    const cutoff = now - this.windowMs;
    const stamps = this.store.get<number[]>(key) ?? [];
    const valid = stamps.filter((t) => t >= cutoff);
    const count = valid.length + weight;

    if (count <= scope.qps) {
      for (let i = 0; i < weight; i++) {
        valid.push(now);
      }
      this.store.set(key, valid, now + this.windowMs);
      return {
        allowed: true,
        retryAfterMs: 0,
        remaining: Math.max(0, scope.qps - count),
        limit: scope.qps,
        limitType: 'qps',
      };
    }

    // 计算最早过期时间
    const oldest = valid.length > 0 ? valid[0] : now;
    const retryAfterMs = Math.max(1, cutoff + this.windowMs - oldest + 1);
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
    // sliding-window 无并发槽
  }

  reset(scope: RateLimitScope): void {
    this.store.delete(`${scope.kind}:${scope.id}`);
  }
}
