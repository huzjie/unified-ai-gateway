/** 金额/百分比/数量格式化 */
export function formatAmount(micro: number): string {
  return `¥${(micro / 1_000_000).toFixed(4)}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function formatPercent(part: number, total: number): string {
  if (total === 0) {
    return '0%';
  }
  return `${((part / total) * 100).toFixed(1)}%`;
}
