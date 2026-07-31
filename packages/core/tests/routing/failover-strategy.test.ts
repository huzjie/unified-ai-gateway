import { FailoverStrategy } from '../../src/routing';
import type { Candidate } from '../../src/routing/types';

describe('FailoverStrategy', () => {
  const strategy = new FailoverStrategy();

  it('选择第一个健康候选', () => {
    const candidates: Candidate[] = [
      { provider: 'a', model: 'm1', healthy: true },
      { provider: 'b', model: 'm2' },
    ];
    expect(strategy.pick(candidates).provider).toBe('a');
  });

  it('跳过 unhealthy', () => {
    const candidates: Candidate[] = [
      { provider: 'a', model: 'm1', healthy: false },
      { provider: 'b', model: 'm2', healthy: true },
      { provider: 'c', model: 'm3', healthy: true },
    ];
    expect(strategy.pick(candidates).provider).toBe('b');
  });

  it('全部不健康回退第一个', () => {
    const candidates: Candidate[] = [
      { provider: 'x', model: 'm', healthy: false },
      { provider: 'y', model: 'm', healthy: false },
    ];
    expect(strategy.pick(candidates).provider).toBe('x');
  });
});
