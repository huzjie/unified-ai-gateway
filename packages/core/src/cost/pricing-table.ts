import type { Price, PricingTable, TokenRole } from '@uag/types';

/**
 * 计价表（读/写/合并）
 * 单价以 CNY / 1K tokens 表示。
 */
export class PricingTableImpl implements PricingTable {
  prices: Record<string, Partial<Record<TokenRole, Price>>>;
  defaultPrice: Price;

  constructor(
    prices: Record<string, Partial<Record<TokenRole, Price>>> = {},
    defaultPrice: Price = { per1k: 0, perRequest: 0 },
  ) {
    this.prices = prices;
    this.defaultPrice = defaultPrice;
  }

  /** 获取价格（未匹配模型时返回默认价） */
  getPrice(model: string, role: TokenRole): Price {
    const entry = this.prices[model];
    if (entry?.[role]) {
      return entry[role] as Price;
    }
    return this.defaultPrice;
  }

  /** 设置价格 */
  setPrice(model: string, role: TokenRole, price: Price): void {
    this.prices[model] = { ...(this.prices[model] ?? {}), [role]: price };
  }

  /** 合并另一计价表（后者覆盖） */
  merge(other: PricingTableImpl): void {
    for (const [model, roles] of Object.entries(other.prices)) {
      this.prices[model] = { ...(this.prices[model] ?? {}), ...roles };
    }
  }

  /** 是否有模型价格 */
  hasPrice(model: string): boolean {
    return Boolean(this.prices[model]);
  }
}

export { PricingTableImpl as PricingTable };
