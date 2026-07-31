import type { RateLimitResult, RateLimitScope, RequestContext } from '@uag/types';
import type { RateLimiter } from './rate-limiter';
import { ConcurrencyLimiter } from './concurrency-limiter';

/**
 * 多作用域（全局/Key）管理器
 * 同一算法实例下按 scope 隔离计数。
 */
export class LimiterManager implements RateLimiter {
  readonly name: string;

  constructor(
    private readonly qpsLimiter: RateLimiter,
    private readonly concurrencyLimiter: ConcurrencyLimiter,
  ) {
    this.name = `manager(${qpsLimiter.name}+concurrency)`;
  }

  check(scope: RateLimitScope, weight = 1): RateLimitResult {
    return this.qpsLimiter.check(scope, weight);
  }

  async acquire(ctx: RequestContext): Promise<RateLimitResult> {
    return this.concurrencyLimiter.acquire(ctx);
  }

  release(ctx: RequestContext): void {
    this.concurrencyLimiter.release(ctx);
  }

  reset(scope: RateLimitScope): void {
    this.qpsLimiter.reset(scope);
    this.concurrencyLimiter.reset(scope);
  }

  /** 获取当前并发数（诊断） */
  getActiveConcurrency(ctx: RequestContext): number {
    return this.concurrencyLimiter.getActive({
      kind: 'key',
      id: ctx.apiKey?.id ?? 'anonymous',
      qps: 0,
    });
  }
}
