/** 金额/数量/时间格式化 */
export function formatAmount(micro: number): string {
  return `¥${(micro / 1_000_000).toFixed(4)}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatTime(iso: string): string {
  return iso.slice(0, 19).replace('T', ' ');
}
