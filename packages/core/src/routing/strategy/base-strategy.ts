import type { Candidate } from '../types';

/**
 * 策略抽象
 */
export interface Strategy {
  readonly name: string;
  /** 从候选中选择 Provider（返回候选对象） */
  pick(candidates: Candidate[]): Candidate;
}

export abstract class BaseStrategy implements Strategy {
  abstract readonly name: string;

  abstract pick(candidates: Candidate[]): Candidate;

  /** 健康候选过滤（保留 healthy 或未标注的） */
  protected healthy(candidates: Candidate[]): Candidate[] {
    return candidates.filter((c) => c.healthy !== false);
  }
}
