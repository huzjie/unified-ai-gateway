import { PriorityStrategy } from '../../src/routing';
import type { Candidate } from '../../src/routing/types';

describe('PriorityStrategy', () => {
  const strategy = new PriorityStrategy();

  it('选择第一个健康候选', () => {
    const candidates: Candidate[] = [
      { provider: 'a', model: 'm1', healthy: true },
      { provider: 'b', model: 'm2', healthy: true },
    ];
    expect(strategy.pick(candidates).provider).toBe('a');
  });

  it('跳过不健康候选', () => {
    const candidates: Candidate[] = [
      { provider: 'a', model: 'm1', healthy: false },
      { provider: 'b', model: 'm2', healthy: true },
    ];
    expect(strategy.pick(candidates).provider).toBe('b');
  });

  it('全部不健康时返回第一个', () => {
    const candidates: Candidate[] = [
      { provider: 'a', model: 'm1', healthy: false },
      { provider: 'b', model: 'm2', healthy: false },
    ];
    expect(strategy.pick(candidates).provider).toBe('a');
  });

  it('空候选抛错', () => {
    expect(() => strategy.pick([])).toThrow();
  });
});
