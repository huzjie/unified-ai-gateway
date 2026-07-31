/**
 * 滑动窗口失败率计算
 * 按时间窗口（默认 60s）统计失败率，避免旧失败影响判定。
 */
export interface SlidingWindowOptions {
  windowMs?: number;
  maxEvents?: number;
}

export class SlidingWindowCounter {
  private readonly windowMs: number;
  private readonly maxEvents: number;
  private events: Array<{ time: number; success: boolean }> = [];

  constructor(options: SlidingWindowOptions = {}) {
    this.windowMs = options.windowMs ?? 60_000;
    this.maxEvents = options.maxEvents ?? 500;
  }

  record(success: boolean, time = Date.now()): void {
    this.events.push({ time, success });
    this.prune(time);
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  /** 窗口内失败率 */
  failureRate(time = Date.now()): number {
    this.prune(time);
    const total = this.events.length;
    if (total === 0) {
      return 0;
    }
    const failures = this.events.filter((e) => !e.success).length;
    return failures / total;
  }

  /** 窗口内总次数 */
  total(time = Date.now()): number {
    this.prune(time);
    return this.events.length;
  }

  /** 窗口内失败次数 */
  failures(time = Date.now()): number {
    this.prune(time);
    return this.events.filter((e) => !e.success).length;
  }

  /** 清理窗口外事件 */
  private prune(time: number): void {
    const cutoff = time - this.windowMs;
    this.events = this.events.filter((e) => e.time >= cutoff);
  }

  reset(): void {
    this.events = [];
  }
}
