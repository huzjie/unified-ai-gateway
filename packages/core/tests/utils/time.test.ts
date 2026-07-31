import { nowIso, toDateOnly, alignToHour, alignToDay, daysAgoIso, hoursAgoIso, parseIso } from '../../src/utils/time';

describe('time utils', () => {
  it('ISO 格式', () => {
    expect(nowIso()).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('日期对齐', () => {
    expect(toDateOnly(new Date('2026-07-31T10:30:00Z'))).toBe('2026-07-31');
    expect(alignToHour('2026-07-31T10:30:00.000Z')).toBe('2026-07-31T10:00');
    expect(alignToDay('2026-07-31T23:59:00.000Z')).toBe('2026-07-31');
  });

  it('相对时间', () => {
    expect(daysAgoIso(1) < nowIso()).toBe(true);
    expect(hoursAgoIso(1) < nowIso()).toBe(true);
  });

  it('解析', () => {
    expect(parseIso('2026-07-31T00:00:00.000Z')).not.toBeNull();
    expect(parseIso('bad')).toBeNull();
  });
});
