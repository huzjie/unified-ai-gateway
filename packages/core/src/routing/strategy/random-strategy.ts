import type { Candidate } from '../types';
import { BaseStrategy } from './base-strategy';

/**
 * 随机策略（带权重）
 * 权重由 candidate.weight 指定，未指定默认 1。
 */
export class RandomStrategy extends BaseStrategy {
  readonly name = 'random';

  pick(candidates: Candidate[]): Candidate {
    const healthyList = this.healthy(candidates);
    const list = healthyList.length > 0 ? healthyList : candidates;
    const totalWeight = list.reduce((sum, c) => sum + (c.weight ?? 1), 0);
    let rand = Math.random() * totalWeight;
    for (const candidate of list) {
      rand -= candidate.weight ?? 1;
      if (rand <= 0) {
        return candidate;
      }
    }
    return list[list.length - 1];
  }
}
