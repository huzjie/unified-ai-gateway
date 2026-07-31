/**
 * 数学工具：分位数 / 百分比 / 微元运算
 */

/** 分位数（0~1） */
export function percentile(values: number[], q: number): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
}

/** P95 */
export function p95(values: number[]): number {
  return percentile(values, 0.95);
}

/** P99 */
export function p99(values: number[]): number {
  return percentile(values, 0.99);
}

/** 均值 */
export function mean(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** 百分比（0~1 → 0~100），保留 decimals */
export function percentage(part: number, total: number, decimals = 2): number {
  if (total <= 0) {
    return 0;
  }
  return Number(((part / total) * 100).toFixed(decimals));
}

/** 安全除法（分母为 0 返回 fallback） */
export function safeDivide(numerator: number, denominator: number, fallback = 0): number {
  if (denominator === 0) {
    return fallback;
  }
  return numerator / denominator;
}

/** 微元乘法（1 元 = 1_000_000 微元） */
export function microMultiply(yuanPer1k: number, tokens: number): number {
  // 单价（元/1K tokens）× tokens / 1000 → 元；× 1_000_000 → 微元
  return Math.round((yuanPer1k * tokens * 1_000_000) / 1000);
}

/** 数值钳制 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
