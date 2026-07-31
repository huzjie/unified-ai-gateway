import { FailureCounter } from '../../src/circuit-breaker';

describe('FailureCounter', () => {
  it('统计成功/失败/失败率', () => {
    const counter = new FailureCounter(100);
    counter.record(true);
    counter.record(false);
    counter.record(false);
    expect(counter.successCount).toBe(1);
    expect(counter.failureCount).toBe(2);
    expect(counter.totalCount).toBe(3);
    expect(counter.failureRate).toBeCloseTo(2 / 3);
  });

  it('空计数失败率为 0', () => {
    const counter = new FailureCounter();
    expect(counter.failureRate).toBe(0);
  });

  it('连续失败计数', () => {
    const counter = new FailureCounter();
    counter.record(true);
    counter.record(false);
    counter.record(false);
    counter.record(false);
    expect(counter.consecutiveFailures).toBe(3);
  });

  it('重置清空', () => {
    const counter = new FailureCounter();
    counter.record(false);
    counter.reset();
    expect(counter.totalCount).toBe(0);
  });
});
