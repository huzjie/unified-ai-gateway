import type { Candidate } from '../types';
import { BaseStrategy } from './base-strategy';

/**
 * 成本优先策略（选单价最低）
 * 以 inputPrice 为主排序，无价格信息时排最后。
 */
export class CostFirstStrategy extends BaseStrategy {
  readonly name = 'cost-first';

  pick(candidates: Candidate[]): Candidate {
    const healthyList = this.healthy(candidates);
    const list = healthyList.length > 0 ? healthyList : candidates;
    return [...list].sort((a, b) => {
      const pa = a.inputPrice ?? Number.POSITIVE_INFINITY;
      const pb = b.inputPrice ?? Number.POSITIVE_INFINITY;
      return pa - pb;
    })[0];
  }
}
