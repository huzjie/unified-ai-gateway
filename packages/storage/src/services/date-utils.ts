/**
 * 日/小时窗口计算
 */
export class DateUtils {
  /** 当前 ISO */
  static nowIso(): string {
    return new Date().toISOString();
  }

  /** YYYY-MM-DD */
  static toDateOnly(date: Date | string = new Date()): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().slice(0, 10);
  }

  /** YYYY-MM-DDTHH:00 */
  static toHour(iso: string | Date): string {
    const d = typeof iso === 'string' ? new Date(iso) : iso;
    return `${d.toISOString().slice(0, 13)}:00`;
  }

  /** 当前日 */
  static today(): string {
    return DateUtils.toDateOnly();
  }

  /** N 天前日期 */
  static daysAgo(days: number): string {
    return DateUtils.toDateOnly(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
  }

  /** N 天前 ISO 时间 */
  static daysAgoIso(days: number): string {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  }

  /** 月度周期标识：YYYY-MM */
  static monthPeriod(date: Date | string = new Date()): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().slice(0, 7);
  }
}
