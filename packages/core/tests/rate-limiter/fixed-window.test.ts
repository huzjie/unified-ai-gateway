import { FixedWindow } from '../../src/rate-limiter';
import type { RateLimitScope } from '../../src/rate-limiter';

describe('FixedWindow', () => {
  const limiter = new FixedWindow(1000);
  const scope: RateLimitScope = { kind: 'key', id: 'k1', qps: 3 };

  it('窗口内允许 qps 次', () => {
    expect(limiter.check(scope).allowed).toBe(true);
    expect(limiter.check(scope).allowed).toBe(true);
    expect(limiter.check(scope).allowed).toBe(true);
    const denied = limiter.check(scope);
    expect(denied.allowed).toBe(false);
    expect(denied.retryAfterMs).toBeGreaterThan(0);
  });

  it('窗口翻转后恢复', async () => {
    for (let i = 0; i < 3; i++) {
      limiter.check(scope);
    }
    expect(limiter.check(scope).allowed).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 1050));
    expect(limiter.check(scope).allowed).toBe(true);
  });

  it('reset 清空', () => {
    for (let i = 0; i < 3; i++) {
      limiter.check(scope);
    }
    limiter.reset(scope);
    expect(limiter.check(scope).allowed).toBe(true);
  });
});
