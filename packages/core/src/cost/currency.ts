/**
 * 币种与微元换算
 * 1 元 = 1_000_000 微元
 */
export const MICRO_PER_YUAN = 1_000_000;
export type Currency = 'CNY';

/** 元 → 微元（取整） */
export function yuanToMicro(yuan: number): number {
  return Math.round(yuan * MICRO_PER_YUAN);
}

/** 微元 → 元 */
export function microToYuan(micro: number): number {
  return Math.round(micro) / MICRO_PER_YUAN;
}

/** 微元四舍五入到 4 位小数展示 */
export function formatMicro(micro: number): string {
  return microToYuan(micro).toFixed(4);
}
