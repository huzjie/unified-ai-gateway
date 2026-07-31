import type { RateLimitResult, RateLimitScope } from '@uag/types';

export type { RateLimitResult, RateLimitScope } from '@uag/types';

/**
 * 限流器接口
 */
export interface RateLimiter {
  /** 同步检查（QPS 窗口内计数）；超限返回 denied + retryAfterMs */
  check(scope: RateLimitScope, weight?: number): RateLimitResult;
  /** 并发槽：进入时 acquire，结束时 release */
  acquire(ctx: import('@uag/types').RequestContext): Promise<RateLimitResult>;
  /** 释放并发槽 */
  release(ctx: import('@uag/types').RequestContext): void;
  /** 重置作用域计数 */
  reset(scope: RateLimitScope): void;
  /** 限流器名称 */
  readonly name: string;
}
