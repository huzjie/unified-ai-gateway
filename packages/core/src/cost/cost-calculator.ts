import type { CostAmount, Usage } from '@uag/types';
import { makeCost } from '@uag/types';
import type { PricingTable } from './pricing-table';
import { microToYuan, yuanToMicro } from './currency';

/**
 * 成本计算（token → 金额，微元运算）
 * 成本 = inputTokens/1000 * inputPer1k + outputTokens/1000 * outputPer1k + perRequest
 * 金额用整数微元运算避免浮点误差。
 */
export class CostCalculator {
  constructor(private readonly pricing: PricingTable) {}

  /** 计算成本 */
  calculate(usage: Usage, model: string): CostAmount {
    const inputPrice = this.pricing.getPrice(model, 'input');
    const outputPrice = this.pricing.getPrice(model, 'output');

    const inputMicro = yuanToMicro((usage.promptTokens / 1000) * inputPrice.per1k);
    const outputMicro = yuanToMicro((usage.completionTokens / 1000) * outputPrice.per1k);
    const requestMicro = yuanToMicro(inputPrice.perRequest + outputPrice.perRequest);

    const totalMicro = inputMicro + outputMicro + requestMicro;
    return makeCost(totalMicro);
  }

  /** 计算单个角色的成本（微元） */
  calculateRole(tokens: number, pricePer1k: number): number {
    return yuanToMicro((tokens / 1000) * pricePer1k);
  }

  /** 便捷：成本 → 元 */
  toYuan(cost: CostAmount): number {
    return microToYuan(cost.micro);
  }
}
