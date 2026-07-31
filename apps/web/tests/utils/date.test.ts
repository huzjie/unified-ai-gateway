import { formatRelativeTime, rangeDays } from '../src/utils/date';

describe('date utils', () => {
  it('相对时间', () => {
    expect(formatRelativeTime(new Date().toISOString())).toBe('刚刚');
    const minutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelativeTime(minutesAgo)).toContain('分钟前');
  });

  it('时间范围', () => {
    const range = rangeDays(7);
    expect(new Date(range.start).getTime()).toBeLessThan(new Date(range.end).getTime());
  });
});
