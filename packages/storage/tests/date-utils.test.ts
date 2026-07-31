import { DateUtils } from '../src/services/date-utils';

describe('DateUtils', () => {
  it('today/日期格式', () => {
    expect(DateUtils.today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(DateUtils.toDateOnly(new Date('2026-07-31T10:00:00Z'))).toBe('2026-07-31');
  });

  it('toHour', () => {
    expect(DateUtils.toHour('2026-07-31T10:30:00.000Z')).toBe('2026-07-31T10:00');
  });

  it('daysAgo', () => {
    expect(DateUtils.daysAgo(0)).toBe(DateUtils.today());
    expect(DateUtils.daysAgoIso(7) < DateUtils.nowIso()).toBe(true);
  });

  it('monthPeriod', () => {
    expect(DateUtils.monthPeriod('2026-07-31T00:00:00.000Z')).toBe('2026-07');
  });
});
