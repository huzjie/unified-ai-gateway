import dayjs from 'dayjs';

/** 相对时间 */
export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  return `${Math.floor(hours / 24)} 天前`;
}

export function formatDateTime(iso: string): string {
  return dayjs(iso).format('YYYY-MM-DD HH:mm:ss');
}

/** 近 N 天时间范围 */
export function rangeDays(days: number): { start: string; end: string } {
  return {
    start: dayjs().subtract(days, 'day').toISOString(),
    end: dayjs().toISOString(),
  };
}
