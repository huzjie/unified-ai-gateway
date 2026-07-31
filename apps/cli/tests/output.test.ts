import { output } from '../src/utils/output';
import { formatAmount, formatNumber, formatTime } from '../src/utils/format';

describe('output utils', () => {
  it('json 输出', () => {
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    output.json({ a: 1 });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('format 工具', () => {
    expect(formatAmount(1_000_000)).toBe('¥1.0000');
    expect(formatNumber(1234567)).toBe('1,234,567');
    expect(formatTime('2026-07-31T10:00:00.000Z')).toBe('2026-07-31 10:00:00');
  });
});
