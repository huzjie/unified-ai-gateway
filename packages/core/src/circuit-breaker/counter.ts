/**
 * 失败计数（最近 N 次请求的成功/失败）
 */
export class FailureCounter {
  private results: boolean[] = [];
  private readonly maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  /** 记录结果（true=成功, false=失败） */
  record(success: boolean): void {
    this.results.push(success);
    if (this.results.length > this.maxSize) {
      this.results = this.results.slice(-this.maxSize);
    }
  }

  /** 失败次数 */
  get failureCount(): number {
    return this.results.filter((r) => !r).length;
  }

  /** 成功次数 */
  get successCount(): number {
    return this.results.filter((r) => r).length;
  }

  /** 总次数 */
  get totalCount(): number {
    return this.results.length;
  }

  /** 失败率（0~1） */
  get failureRate(): number {
    if (this.totalCount === 0) {
      return 0;
    }
    return this.failureCount / this.totalCount;
  }

  /** 连续失败次数（从尾部） */
  get consecutiveFailures(): number {
    let count = 0;
    for (let i = this.results.length - 1; i >= 0; i--) {
      if (!this.results[i]) {
        count += 1;
      } else {
        break;
      }
    }
    return count;
  }

  /** 重置 */
  reset(): void {
    this.results = [];
  }
}
