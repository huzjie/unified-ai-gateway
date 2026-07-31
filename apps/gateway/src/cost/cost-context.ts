import type { CostAmount, Usage } from '@uag/types';
import { makeCost } from '@uag/types';

/**
 * 请求成本上下文
 */
export class CostContext {
  private usage: Usage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
  private cost: CostAmount = makeCost(0);

  setUsage(usage: Usage): void {
    this.usage = usage;
  }

  setCost(cost: CostAmount): void {
    this.cost = cost;
  }

  getUsage(): Usage {
    return this.usage;
  }

  getCost(): CostAmount {
    return this.cost;
  }
}
