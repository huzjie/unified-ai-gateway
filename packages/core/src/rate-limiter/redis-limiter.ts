import type { RateLimitResult, RateLimitScope } from '@uag/types';
import type { RateLimiter } from './rate-limiter';

/**
 * Redis 共享实现（P2，接口兼容）
 * 说明：M1 默认内存实现；启用 Redis 时通过 Lua 脚本实现原子计数。
 * 本类为接口占位 + 可选的 ioredis 实现骨架（依赖可选注入）。
 */
export interface RedisLike {
  eval(script: string, keys: string[], args: string[]): Promise<unknown>;
}

export class RedisLimiter implements Omit<RateLimiter, 'check'> {
  readonly name = 'redis';

  private readonly INCR_SCRIPT = `
local current = redis.call('INCR', KEYS[1])
if current == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
return current
`;

  constructor(
    private readonly client: RedisLike,
    private readonly windowMs = 1000,
  ) {}

  /** 异步检查（Redis 场景） */
  async checkAsync(scope: RateLimitScope, _weight = 1): Promise<RateLimitResult> {
    const key = `uag:rl:${scope.kind}:${scope.id}`;
    const current = (await this.client.eval(this.INCR_SCRIPT, [key], [String(this.windowMs)])) as number;
    if (current <= scope.qps) {
      return { allowed: true, retryAfterMs: 0, remaining: Math.max(0, scope.qps - current), limit: scope.qps, limitType: 'qps' };
    }
    return { allowed: false, retryAfterMs: 1000, remaining: 0, limit: scope.qps, limitType: 'qps' };
  }

  /** 同步检查（内存降级，不占用计数） */
  check(): RateLimitResult {
    return { allowed: true, retryAfterMs: 0, remaining: Number.MAX_SAFE_INTEGER, limit: 0, limitType: 'qps' };
  }

  async acquire(): Promise<RateLimitResult> {
    return { allowed: true, retryAfterMs: 0, remaining: 0, limit: 0, limitType: 'qps' };
  }

  release(): void {
    // Redis 并发槽由单独脚本管理
  }

  reset(_scope: RateLimitScope): void {
    // 通过 client.del 实现（接口未暴露，此处为骨架）
  }
}
