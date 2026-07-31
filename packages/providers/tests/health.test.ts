import { HealthChecker } from '../src/health/health-checker';
import { HealthStatusAggregator } from '../src/health/health-status';
import { MockProvider } from '../src/mock/mock-provider';

describe('HealthChecker', () => {
  it('检查 mock 返回 healthy', async () => {
    const checker = new HealthChecker();
    const status = await checker.check(new MockProvider({ name: 'm' }));
    expect(status).toBe('healthy');
  });

  it('检查全部', async () => {
    const checker = new HealthChecker();
    const results = await checker.checkAll([new MockProvider({ name: 'a' }), new MockProvider({ name: 'b' })]);
    expect(results.length).toBe(2);
    expect(results.every((r) => r.status === 'healthy')).toBe(true);
  });

  it('定时检查可取消', async () => {
    const checker = new HealthChecker();
    const results: string[] = [];
    const stop = checker.startInterval(new MockProvider({ name: 'm' }), 10, (_n, s) => results.push(s));
    await new Promise((resolve) => setTimeout(resolve, 50));
    stop();
    checker.stopAll();
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('HealthStatusAggregator', () => {
  it('聚合', () => {
    const agg = new HealthStatusAggregator();
    expect(agg.aggregate(['healthy', 'healthy'])).toBe('healthy');
    expect(agg.aggregate(['healthy', 'unhealthy'])).toBe('unhealthy');
    expect(agg.aggregate([])).toBe('unknown');
    expect(agg.aggregate(['unknown', 'checking'])).toBe('unknown');
  });

  it('统计分布', () => {
    const agg = new HealthStatusAggregator();
    const s = agg.summarize(['healthy', 'unhealthy', 'unknown', 'healthy']);
    expect(s).toEqual({ healthy: 2, unhealthy: 1, unknown: 1 });
  });
});
