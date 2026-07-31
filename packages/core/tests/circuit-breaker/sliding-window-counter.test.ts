import { SlidingWindowCounter } from '../../src/circuit-breaker';

describe('SlidingWindowCounter', () => {
  it('窗口内失败率', () => {
    const counter = new SlidingWindowCounter({ windowMs: 1000 });
    counter.record(true, 0);
    counter.record(false, 10);
    counter.record(false, 20);
    expect(counter.failureRate(30)).toBeCloseTo(2 / 3);
    expect(counter.failures(30)).toBe(2);
    expect(counter.total(30)).toBe(3);
  });

  it('窗口外事件被清理', () => {
    const counter = new SlidingWindowCounter({ windowMs: 1000 });
    counter.record(true, 0);
    counter.record(false, 2000);
    expect(counter.total(2500)).toBe(1);
    expect(counter.failureRate(2500)).toBe(1);
  });

  it('reset 清空', () => {
    const counter = new SlidingWindowCounter();
    counter.record(true, 0);
    counter.reset();
    expect(counter.total(10)).toBe(0);
  });
});
