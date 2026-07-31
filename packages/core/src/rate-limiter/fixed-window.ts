import type { RateLimitResult, RateLimitScope } from '@uag/types';
import type { RateLimiter } from './rate-limiter';
import { MemoryStore } from './memory-store';

/**
 * 固定窗口实现
 * 每 scope 一个窗口（windowMs），窗口内计数 ≤ qps。
 */
export class FixedWindow implements RateLimiter {
  readonly name = 'fixed-window';

  constructor(
    private readonly windowMs: number,
    private readonly store: MemoryStore = new MemoryStore(),
  ) {}

  check(scope: RateLimitScope, weight = 1): RateLimitResult {
    const key = `${scope.kind}:${scope.id}`;
    const now = Date.now();
    const windowKey = Math.floor(now / this.windowMs);
    const count = this.store.incr(`${key}:${windowKey}`, weight);

    if (count <= scope.qps) {
      const remaining = Math.max(0, scope.qps - count);
      return {
        allowed: true,
        retryAfterMs: 0,
        remaining,
        limit: scope.qps,
        limitType: 'qps',
      };
    }

    // 窗口结束时间
    const windowEnd = (windowKey + 1) * this.windowMs;
    const retryAfterMs = Math.max(1, windowEnd - now);
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
    // fixed-window 无并发槽
  }

  reset(scope: RateLimitScope): void {
    this.store.deletePrefix(`${scope.kind}:${scope.id}`);
  }
}
