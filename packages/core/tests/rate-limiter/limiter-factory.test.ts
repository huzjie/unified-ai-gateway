import { LimiterFactory } from '../../src/rate-limiter';
import { TokenBucket } from '../../src/rate-limiter';
import { FixedWindow } from '../../src/rate-limiter';
import { SlidingWindow } from '../../src/rate-limiter';

describe('LimiterFactory', () => {
  it('创建各算法限流器', () => {
    expect(new LimiterFactory({ algorithm: 'token-bucket', windowMs: 1000 }).create()).toBeInstanceOf(TokenBucket);
    expect(new LimiterFactory({ algorithm: 'fixed-window', windowMs: 1000 }).create()).toBeInstanceOf(FixedWindow);
    expect(new LimiterFactory({ algorithm: 'sliding-window', windowMs: 1000 }).create()).toBeInstanceOf(SlidingWindow);
  });

  it('未知算法回退 token-bucket', () => {
    const factory = new LimiterFactory({ algorithm: 'unknown' as never, windowMs: 1000 });
    expect(factory.create()).toBeInstanceOf(TokenBucket);
  });

  it('默认工厂', () => {
    expect(LimiterFactory.default().create()).toBeInstanceOf(TokenBucket);
  });
});
