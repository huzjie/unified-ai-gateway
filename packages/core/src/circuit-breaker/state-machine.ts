import type { BreakerState } from '@uag/types';

/**
 * CLOSED/OPEN/HALF_OPEN 状态机
 * 纯状态转换逻辑，不包含统计。
 */
export class StateMachine {
  private state: BreakerState = 'CLOSED';
  private openedAt: number | null = null;

  constructor(
    private readonly openMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  getState(): BreakerState {
    // 打开超时 → 自动进入 HALF_OPEN
    if (this.state === 'OPEN' && this.openedAt !== null) {
      if (this.now() - this.openedAt >= this.openMs) {
        this.state = 'HALF_OPEN';
      }
    }
    return this.state;
  }

  /** 触发打开 */
  open(): void {
    this.state = 'OPEN';
    this.openedAt = this.now();
  }

  /** 关闭（成功恢复） */
  close(): void {
    this.state = 'CLOSED';
    this.openedAt = null;
  }

  /** 进入半开（探测） */
  halfOpen(): void {
    this.state = 'HALF_OPEN';
  }

  /** 打开剩余时间（ms） */
  get retryAfterMs(): number {
    if (this.state !== 'OPEN' || this.openedAt === null) {
      return 0;
    }
    return Math.max(0, this.openMs - (this.now() - this.openedAt));
  }

  /** 是否可放行（CLOSED 或 HALF_OPEN） */
  canAllow(): boolean {
    const s = this.getState();
    return s === 'CLOSED' || s === 'HALF_OPEN';
  }

  reset(): void {
    this.state = 'CLOSED';
    this.openedAt = null;
  }
}
