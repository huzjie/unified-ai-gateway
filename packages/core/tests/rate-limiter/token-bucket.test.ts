import { TokenBucket } from '../../src/rate-limiter';
import type { RateLimitScope } from '../../src/rate-limiter';

describe('TokenBucket', () => {
  const bucket = new TokenBucket();
  const scope: RateLimitScope = { kind: 'key', id: 'k1', qps: 5, burst: 5 };

  beforeEach(() => bucket.clear());

  it('允许 qps 内请求', () => {
    for (let i = 0; i < 5; i++) {
      const r = bucket.check(scope);
      expect(r.allowed).toBe(true);
      expect(r.limitType).toBe('qps');
    }
  });

  it('超出容量被拒且返回 retryAfterMs', () => {
    for (let i = 0; i < 5; i++) {
      bucket.check(scope);
    }
    const denied = bucket.check(scope);
    expect(denied.allowed).toBe(false);
    expect(denied.retryAfterMs).toBeGreaterThan(0);
  });

  it('按 qps 速率补充令牌', async () => {
    for (let i = 0; i < 5; i++) {
      bucket.check(scope);
    }
    // 等待 1.2s 补充约 6 个令牌
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const r = bucket.check(scope);
    expect(r.allowed).toBe(true);
  });

  it('不同 scope 隔离', () => {
    const scopeB: RateLimitScope = { kind: 'key', id: 'k2', qps: 5, burst: 5 };
    for (let i = 0; i < 5; i++) {
      bucket.check(scope);
    }
    expect(bucket.check(scopeB).allowed).toBe(true);
  });

  it('reset 清空计数', () => {
    for (let i = 0; i < 5; i++) {
      bucket.check(scope);
    }
    bucket.reset(scope);
    expect(bucket.check(scope).allowed).toBe(true);
  });
});
