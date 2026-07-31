import type { RateLimitResult, RateLimitScope, RequestContext } from '@uag/types';
import type { RateLimiter } from './rate-limiter';

/**
 * 并发数限制器
 * acquire 占用一个槽，release 释放；超限返回 denied + retryAfterMs。
 */
export class ConcurrencyLimiter implements RateLimiter {
  readonly name = 'concurrency';

  private readonly active = new Map<string, number>();

  /** 获取当前并发数 */
  getActive(scope: RateLimitScope): number {
    return this.active.get(`${scope.kind}:${scope.id}`) ?? 0;
  }

  /** 并发检查（不占用槽） */
  check(scope: RateLimitScope): RateLimitResult {
    const key = `${scope.kind}:${scope.id}`;
    const current = this.active.get(key) ?? 0;
    const limit = scope.concurrency ?? Number.POSITIVE_INFINITY;
    if (current < limit) {
      return { allowed: true, retryAfterMs: 0, remaining: Math.max(0, limit - current), limit, limitType: 'concurrency' };
    }
    return { allowed: false, retryAfterMs: 1000, remaining: 0, limit, limitType: 'concurrency' };
  }

  /** 占用并发槽 */
  async acquire(ctx: RequestContext): Promise<RateLimitResult> {
    const scope: RateLimitScope = {
      kind: 'key',
      id: ctx.apiKey?.id ?? 'anonymous',
      qps: 0,
      concurrency: ctx.apiKey?.concurrencyLimit ?? Number.POSITIVE_INFINITY,
    };
    const result = this.check(scope);
    if (result.allowed) {
      const key = `${scope.kind}:${scope.id}`;
      this.active.set(key, (this.active.get(key) ?? 0) + 1);
      ctx.headers['x-uag-concurrency'] = String(this.active.get(key));
    }
    return result;
  }

  /** 释放并发槽 */
  release(ctx: RequestContext): void {
    const key = `key:${ctx.apiKey?.id ?? 'anonymous'}`;
    const current = this.active.get(key) ?? 0;
    if (current > 0) {
      this.active.set(key, current - 1);
    } else {
      this.active.delete(key);
    }
  }

  reset(scope: RateLimitScope): void {
    this.active.delete(`${scope.kind}:${scope.id}`);
  }
}
