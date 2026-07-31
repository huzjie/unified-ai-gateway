/**
 * 金额类型
 * 约定：金额计算用整数微元（1 元 = 1_000_000 微元）避免浮点误差；
 * 落库保留 6 位小数，展示四舍五入 4 位；币种统一 CNY。
 */
export type Currency = 'CNY';

/** 整数微元金额 */
export type MicroAmount = number;

/** 展示金额（元，4 位小数） */
export type DisplayAmount = number;

/** 微元 → 元 */
export function microToYuan(micro: MicroAmount): DisplayAmount {
  return Math.round(micro) / 1_000_000;
}

/** 元 → 微元（取整） */
export function yuanToMicro(yuan: number): MicroAmount {
  return Math.round(yuan * 1_000_000);
}

/** 微元四舍五入到 4 位小数展示 */
export function formatMicroAmount(micro: MicroAmount): string {
  return microToYuan(micro).toFixed(4);
}

/** 成本金额（含币种） */
export interface CostAmount {
  /** 微元 */
  micro: MicroAmount;
  /** 元（4 位小数） */
  yuan: DisplayAmount;
  currency: Currency;
}

/** 构造成本金额 */
export function makeCost(micro: MicroAmount, currency: Currency = 'CNY'): CostAmount {
  return { micro, yuan: microToYuan(micro), currency };
}
