import { RandomStrategy } from '../../src/routing';
import type { Candidate } from '../../src/routing/types';

describe('RandomStrategy', () => {
  it('返回候选之一', () => {
    const strategy = new RandomStrategy();
    const candidates: Candidate[] = [
      { provider: 'a', model: 'm' },
      { provider: 'b', model: 'm' },
      { provider: 'c', model: 'm' },
    ];
    for (let i = 0; i < 50; i++) {
      const picked = strategy.pick(candidates).provider;
      expect(['a', 'b', 'c']).toContain(picked);
    }
  });

  it('高权重候选更常被选中（粗略统计）', () => {
    const strategy = new RandomStrategy();
    const candidates: Candidate[] = [
      { provider: 'heavy', model: 'm', weight: 90 },
      { provider: 'light', model: 'm', weight: 10 },
    ];
    let heavy = 0;
    for (let i = 0; i < 200; i++) {
      if (strategy.pick(candidates).provider === 'heavy') {
        heavy += 1;
      }
    }
    expect(heavy).toBeGreaterThan(100);
  });

  it('单个候选恒选中', () => {
    const strategy = new RandomStrategy();
    const candidates: Candidate[] = [{ provider: 'only', model: 'm' }];
    expect(strategy.pick(candidates).provider).toBe('only');
  });
});
