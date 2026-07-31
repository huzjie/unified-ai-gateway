import { HealthAwareFilter } from '../../src/routing';
import { BreakerRegistry } from '../../src/circuit-breaker';
import type { Candidate } from '../../src/routing/types';

describe('HealthAwareFilter', () => {
  it('过滤熔断 OPEN 的候选', () => {
    const breaker = new BreakerRegistry({ failureThreshold: 0.5, minRequests: 1, openMs: 100000 });
    breaker.recordFailure('bad');
    breaker.recordFailure('bad');
    const filter = new HealthAwareFilter(breaker);
    const candidates: Candidate[] = [
      { provider: 'bad', model: 'm', healthy: true },
      { provider: 'good', model: 'm', healthy: true },
    ];
    const healthy = filter.filterHealthy(candidates);
    expect(healthy.map((c) => c.provider)).toEqual(['good']);
  });

  it('CLOSED 状态全部放行', () => {
    const breaker = new BreakerRegistry();
    const filter = new HealthAwareFilter(breaker);
    expect(filter.isHealthy('x')).toBe(true);
    expect(filter.getState('x')).toBe('CLOSED');
  });
});
