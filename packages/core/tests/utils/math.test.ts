import { percentile, p95, p99, mean, percentage, safeDivide, microMultiply, clamp } from '../../src/utils';

describe('math utils', () => {
  it('百分位数', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(percentile(values, 0.5)).toBeCloseTo(5.5);
    expect(p95(values)).toBeCloseTo(9.55);
    expect(p99(values)).toBeCloseTo(9.91);
  });

  it('空数组百分位为 0', () => {
    expect(p95([])).toBe(0);
  });

  it('均值', () => {
    expect(mean([1, 2, 3])).toBe(2);
    expect(mean([])).toBe(0);
  });

  it('百分比', () => {
    expect(percentage(50, 100)).toBe(50);
    expect(percentage(1, 0)).toBe(0);
  });

  it('安全除法', () => {
    expect(safeDivide(10, 2)).toBe(5);
    expect(safeDivide(10, 0)).toBe(0);
  });

  it('微元乘法', () => {
    // 10 元/1K × 1000 tokens = 10 元 = 10_000_000 微元
    expect(microMultiply(10, 1000)).toBe(10_000_000);
    // 1 元/1K × 500 tokens = 0.5 元 = 500_000 微元
    expect(microMultiply(1, 500)).toBe(500_000);
  });

  it('钳制', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
