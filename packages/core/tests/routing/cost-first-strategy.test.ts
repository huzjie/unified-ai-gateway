import { CostFirstStrategy } from '../../src/routing';
import type { Candidate } from '../../src/routing/types';

describe('CostFirstStrategy', () => {
  const strategy = new CostFirstStrategy();

  it('选择单价最低', () => {
    const candidates: Candidate[] = [
      { provider: 'expensive', model: 'm', inputPrice: 10 },
      { provider: 'cheap', model: 'm', inputPrice: 1 },
      { provider: 'mid', model: 'm', inputPrice: 5 },
    ];
    expect(strategy.pick(candidates).provider).toBe('cheap');
  });

  it('无价格候选排最后', () => {
    const candidates: Candidate[] = [
      { provider: 'no-price', model: 'm' },
      { provider: 'cheap', model: 'm', inputPrice: 0.5 },
    ];
    expect(strategy.pick(candidates).provider).toBe('cheap');
  });

  it('全部无价格时选第一个', () => {
    const candidates: Candidate[] = [
      { provider: 'a', model: 'm' },
      { provider: 'b', model: 'm' },
    ];
    expect(strategy.pick(candidates).provider).toBe('a');
  });
});
