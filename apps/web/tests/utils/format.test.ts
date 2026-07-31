import { formatAmount, formatNumber, formatPercent } from '../src/utils/format';

describe('format utils', () => {
  it('金额格式化', () => {
    expect(formatAmount(1_000_000)).toBe('¥1.0000');
    expect(formatAmount(326_400)).toBe('¥0.3264');
  });

  it('数量格式化', () => {
    expect(formatNumber(128430)).toBe('128,430');
  });

  it('百分比格式化', () => {
    expect(formatPercent(50, 100)).toBe('50.0%');
    expect(formatPercent(1, 0)).toBe('0%');
  });
});
