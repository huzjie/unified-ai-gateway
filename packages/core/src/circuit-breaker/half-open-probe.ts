/**
 * 半开探测（放行比例）
 * HALF_OPEN 状态按比例放行请求探测恢复。
 */
export class HalfOpenProbe {
  private allowed = 0;
  private rejected = 0;

  constructor(
    /** 放行比例（0~1），默认 0.5 */
    private readonly ratio = 0.5,
  ) {}

  /** 是否允许探测请求通过 */
  allow(): boolean {
    const total = this.allowed + this.rejected;
    // 无样本时放行
    if (total === 0) {
      this.allowed += 1;
      return true;
    }
    const currentRatio = this.allowed / total;
    if (currentRatio < this.ratio) {
      this.allowed += 1;
      return true;
    }
    this.rejected += 1;
    return false;
  }

  /** 记录成功（探测通过） */
  recordSuccess(): void {
    this.allowed += 1;
  }

  /** 记录失败 */
  recordFailure(): void {
    this.rejected += 1;
  }

  /** 重置探测计数 */
  reset(): void {
    this.allowed = 0;
    this.rejected = 0;
  }

  /** 当前放行率 */
  get currentRatio(): number {
    const total = this.allowed + this.rejected;
    return total === 0 ? 1 : this.allowed / total;
  }
}
