import type { TokenRole } from '../common/status';

/**
 * 计价表类型
 * 约定：单价以 CNY / 1K tokens 表示；金额运算用整数微元。
 */
export interface Price {
  /** 单价（元 / 1K tokens） */
  per1k: number;
  /** 按请求固定费用（元/次），默认 0 */
  perRequest: number;
}

export interface PricingTable {
  /** 模型名 → 价格 */
  prices: Record<string, Partial<Record<TokenRole, Price>>>;
  /** 默认价格（未匹配模型时） */
  defaultPrice: Price;
}

/** 从 Provider 配置计价条目构造 Price */
export function toPrice(entry: { input: number; output: number; perRequest?: number }): Record<TokenRole, Price> {
  return {
    input: { per1k: entry.input, perRequest: entry.perRequest ?? 0 },
    output: { per1k: entry.output, perRequest: entry.perRequest ?? 0 },
  };
}
