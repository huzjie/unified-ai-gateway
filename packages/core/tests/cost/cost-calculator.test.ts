import { CostCalculator } from '../../src/cost';
import { PricingTableImpl } from '../../src/cost';

describe('CostCalculator', () => {
  it('按 token 计算成本（微元）', () => {
    const pricing = new PricingTableImpl({
      'gpt-4o': {
        input: { per1k: 10, perRequest: 0 },
        output: { per1k: 30, perRequest: 0 },
      },
    });
    const calculator = new CostCalculator(pricing);
    const cost = calculator.calculate({ promptTokens: 1000, completionTokens: 500, totalTokens: 1500 }, 'gpt-4o');
    // 1000/1000*10 + 500/1000*30 = 10 + 15 = 25 元 = 25_000_000 微元
    expect(cost.micro).toBe(25_000_000);
    expect(cost.currency).toBe('CNY');
  });

  it('默认价格（未匹配模型）', () => {
    const pricing = new PricingTableImpl({}, { per1k: 1, perRequest: 0 });
    const calculator = new CostCalculator(pricing);
    const cost = calculator.calculate({ promptTokens: 1000, completionTokens: 0, totalTokens: 1000 }, 'unknown-model');
    expect(cost.micro).toBe(1_000_000);
  });

  it('按请求固定费用', () => {
    const pricing = new PricingTableImpl({
      m: { input: { per1k: 1, perRequest: 0.5 }, output: { per1k: 1, perRequest: 0.5 } },
    });
    const calculator = new CostCalculator(pricing);
    const cost = calculator.calculate({ promptTokens: 0, completionTokens: 0, totalTokens: 0 }, 'm');
    // 固定费 1 元
    expect(cost.micro).toBe(1_000_000);
  });

  it('微元取整避免浮点误差', () => {
    const pricing = new PricingTableImpl({
      m: { input: { per1k: 0.001, perRequest: 0 }, output: { per1k: 0.001, perRequest: 0 } },
    });
    const calculator = new CostCalculator(pricing);
    const cost = calculator.calculate({ promptTokens: 1, completionTokens: 1, totalTokens: 2 }, 'm');
    // (1/1000)*0.001 元 = 1e-6 元 = 1 微元
    expect(cost.micro).toBe(2);
  });
});
