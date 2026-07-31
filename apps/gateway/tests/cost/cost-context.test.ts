import { CostContext } from '../../src/cost/cost-context';

describe('CostContext', () => {
  it('usage/cost 存取', () => {
    const ctx = new CostContext();
    ctx.setUsage({ promptTokens: 100, completionTokens: 50, totalTokens: 150 });
    expect(ctx.getUsage().totalTokens).toBe(150);
    ctx.setCost({ micro: 1000, yuan: 0.001, currency: 'CNY' });
    expect(ctx.getCost().micro).toBe(1000);
  });
});
