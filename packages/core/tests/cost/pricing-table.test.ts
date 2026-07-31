import { PricingTableImpl } from '../../src/cost';

describe('PricingTable', () => {
  it('设置与获取价格', () => {
    const table = new PricingTableImpl();
    table.setPrice('m1', 'input', { per1k: 1, perRequest: 0 });
    expect(table.getPrice('m1', 'input').per1k).toBe(1);
    expect(table.getPrice('m1', 'output').per1k).toBe(0); // 默认
  });

  it('合并计价表', () => {
    const a = new PricingTableImpl({ m1: { input: { per1k: 1, perRequest: 0 } } });
    const b = new PricingTableImpl({ m2: { output: { per1k: 2, perRequest: 0 } } });
    a.merge(b);
    expect(a.hasPrice('m1')).toBe(true);
    expect(a.hasPrice('m2')).toBe(true);
  });

  it('默认价格', () => {
    const table = new PricingTableImpl({}, { per1k: 3, perRequest: 0 });
    expect(table.getPrice('anything', 'input').per1k).toBe(3);
  });
});
