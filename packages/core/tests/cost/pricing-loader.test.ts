import { PricingLoader } from '../../src/cost/pricing-loader';

describe('PricingLoader', () => {
  it('加载计价表', () => {
    const loader = new PricingLoader();
    const table = loader.load({
      'kimi-k3': { input: 4, output: 16 },
    });
    expect(table.getPrice('kimi-k3', 'input').per1k).toBe(4);
    expect(table.getPrice('kimi-k3', 'output').per1k).toBe(16);
    // 未匹配模型用默认价
    expect(table.getPrice('unknown', 'input').per1k).toBe(0);
  });

  it('默认价可配置', () => {
    const loader = new PricingLoader();
    const table = loader.load({}, { input: 1, output: 2 });
    expect(table.getPrice('x', 'input').per1k).toBe(1);
  });

  it('合并多 Provider 计价', () => {
    const loader = new PricingLoader();
    const table = loader.loadFromProviders([
      { name: 'a', pricing: { 'm1': { input: 1, output: 2 } } },
      { name: 'b', pricing: { 'm2': { input: 3, output: 4 } } },
    ]);
    expect(table.hasPrice('m1')).toBe(true);
    expect(table.hasPrice('m2')).toBe(true);
  });
});
