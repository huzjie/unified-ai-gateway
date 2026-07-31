import { SlidingWindow } from '../../src/rate-limiter';
import type { RateLimitScope } from '../../src/rate-limiter';

describe('SlidingWindow', () => {
  const limiter = new SlidingWindow(1000);
  const scope: RateLimitScope = { kind: 'key', id: 'k1', qps: 2 };

  beforeEach(() => {
    limiter.reset(scope);
  });

  it('窗口内允许 qps 次', () => {
    expect(limiter.check(scope).allowed).toBe(true);
    expect(limiter.check(scope).allowed).toBe(true);
    expect(limiter.check(scope).allowed).toBe(false);
  });

  it('旧请求过期后恢复', async () => {
    expect(limiter.check(scope).allowed).toBe(true);
    expect(limiter.check(scope).allowed).toBe(true);
    expect(limiter.check(scope).allowed).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 1050));
    expect(limiter.check(scope).allowed).toBe(true);
  });

  it('reset 清空', () => {
    limiter.check(scope);
    limiter.check(scope);
    limiter.reset(scope);
    expect(limiter.check(scope).allowed).toBe(true);
  });
});
