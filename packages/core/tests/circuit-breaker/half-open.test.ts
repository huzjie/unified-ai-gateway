import { HalfOpenProbe } from '../../src/circuit-breaker';

describe('HalfOpenProbe', () => {
  it('初始放行（无样本）', () => {
    const probe = new HalfOpenProbe(0.5);
    expect(probe.allow()).toBe(true);
  });

  it('按比例放行探测请求', () => {
    const probe = new HalfOpenProbe(0.5);
    probe.allow(); // allowed=1
    // ratio 1.0 > 0.5 → reject
    expect(probe.allow()).toBe(false);
    probe.recordSuccess(); // allowed=2
    // ratio 2/3 > 0.5 → reject
    expect(probe.allow()).toBe(false);
  });

  it('reset 重置计数', () => {
    const probe = new HalfOpenProbe(0.5);
    probe.allow();
    probe.allow();
    probe.reset();
    expect(probe.allow()).toBe(true);
  });
});
