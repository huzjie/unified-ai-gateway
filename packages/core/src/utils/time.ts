/**
 * 时间工具（ISO/窗口对齐）
 */
export type { ISODateTime, ISODate, ISOHour } from '@uag/types';

/** 当前时间 ISO8601 UTC */
export function nowIso(): string {
  return new Date().toISOString();
}

/** 当前时间毫秒 */
export function nowMs(): number {
  return Date.now();
}

/** Date → ISO8601 */
export function toIso(date: Date): string {
  return date.toISOString();
}

/** Date → YYYY-MM-DD */
export function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** 对齐到小时：YYYY-MM-DDTHH:00 */
export function alignToHour(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return `${d.toISOString().slice(0, 13)}:00`;
}

/** 对齐到日：YYYY-MM-DD */
export function alignToDay(iso: string | Date): string {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toISOString().slice(0, 10);
}

/** 解析 ISO 时间（无效返回 null） */
export function parseIso(iso: string): Date | null {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** 距现在 N 天前的 ISO 时间 */
export function daysAgoIso(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

/** 距现在 N 小时前的 ISO 时间 */
export function hoursAgoIso(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}
