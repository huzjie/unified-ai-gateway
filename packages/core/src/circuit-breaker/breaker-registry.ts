import type { BreakerDecision, BreakerState, BreakerStateSnapshot, CircuitBreakerConfig } from '@uag/types';
import type { CircuitBreaker } from './circuit-breaker';
import { StateMachine } from './state-machine';
import { SlidingWindowCounter } from './sliding-window-counter';
import { HalfOpenProbe } from './half-open-probe';

/**
 * 熔断器注册表（按 provider/model 维度）
 * 管理多个 providerKey 的熔断器实例。
 */
export class BreakerRegistry implements CircuitBreaker {
  private readonly breakers = new Map<string, Breaker>();

  constructor(private readonly config: CircuitBreakerConfig = {}) {}

  /** 获取（或创建）指定 providerKey 的熔断器 */
  get(providerKey: string): Breaker {
    let breaker = this.breakers.get(providerKey);
    if (!breaker) {
      breaker = new Breaker(this.config);
      this.breakers.set(providerKey, breaker);
    }
    return breaker;
  }

  allow(providerKey: string): BreakerDecision {
    return this.get(providerKey).allow(providerKey);
  }

  recordSuccess(providerKey: string): void {
    this.get(providerKey).recordSuccess(providerKey);
  }

  recordFailure(providerKey: string, error?: Error): void {
    this.get(providerKey).recordFailure(providerKey, error);
  }

  getState(providerKey: string): BreakerState {
    return this.get(providerKey).getState(providerKey);
  }

  reset(providerKey: string): void {
    this.get(providerKey).reset(providerKey);
  }

  /** 重置全部 */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }

  /** 全部状态快照 */
  snapshots(): Array<BreakerStateSnapshot & { providerKey: string }> {
    return [...this.breakers.entries()].map(([providerKey, breaker]) => ({
      ...breaker.snapshot(),
      providerKey,
    }));
  }

  /** 已注册熔断器数量 */
  get size(): number {
    return this.breakers.size;
  }
}

/**
 * 单个 Provider 熔断器
 * 每个实例独立状态机 + 滑动窗口计数 + 半开探测。
 */
export class Breaker implements CircuitBreaker {
  private readonly config: Required<CircuitBreakerConfig>;
  private readonly stateMachine: StateMachine;
  private readonly counter: SlidingWindowCounter;
  private readonly probe: HalfOpenProbe;
  private lastFailureAt: number | null = null;

  constructor(config: CircuitBreakerConfig, now: () => number = Date.now) {
    this.config = {
      failureThreshold: config.failureThreshold ?? 0.5,
      minRequests: config.minRequests ?? 10,
      openMs: config.openMs ?? 30_000,
      halfOpenRatio: config.halfOpenRatio ?? 0.5,
      consecutiveFailures: config.consecutiveFailures ?? 0,
    };
    this.stateMachine = new StateMachine(this.config.openMs, now);
    this.counter = new SlidingWindowCounter({ windowMs: 60_000, maxEvents: 500 });
    this.probe = new HalfOpenProbe(this.config.halfOpenRatio);
  }

  allow(_providerKey: string): BreakerDecision {
    const state = this.stateMachine.getState();
    if (state === 'OPEN') {
      return { allowed: false, state, retryAfterMs: this.stateMachine.retryAfterMs };
    }
    if (state === 'HALF_OPEN') {
      if (this.probe.allow()) {
        return { allowed: true, state };
      }
      return { allowed: false, state, retryAfterMs: 100 };
    }
    return { allowed: true, state };
  }

  recordSuccess(_providerKey: string): void {
    this.counter.record(true);
    this.probe.recordSuccess();
    if (this.stateMachine.getState() === 'HALF_OPEN') {
      this.stateMachine.close();
      this.probe.reset();
    }
  }

  recordFailure(_providerKey: string, error?: Error): void {
    void error;
    this.counter.record(false);
    this.probe.recordFailure();
    this.lastFailureAt = Date.now();
    const state = this.stateMachine.getState();

    if (state === 'HALF_OPEN') {
      this.stateMachine.open();
      return;
    }

    if (state === 'CLOSED') {
      const total = this.counter.total();
      const rate = this.counter.failureRate();
      const consecutive = this.consecutiveFailures();
      const thresholdMet =
        total >= this.config.minRequests &&
        rate >= this.config.failureThreshold;
      const consecutiveMet =
        this.config.consecutiveFailures > 0 &&
        consecutive >= this.config.consecutiveFailures;
      if (thresholdMet || consecutiveMet) {
        this.stateMachine.open();
      }
    }
  }

  getState(_providerKey: string): BreakerState {
    return this.stateMachine.getState();
  }

  reset(_providerKey?: string): void {
    this.stateMachine.reset();
    this.counter.reset();
    this.probe.reset();
    this.lastFailureAt = null;
  }

  /** 状态快照 */
  snapshot(): BreakerStateSnapshot {
    const state = this.stateMachine.getState();
    return {
      providerKey: '',
      state,
      failureCount: this.counter.failures(),
      successCount: this.counter.total() - this.counter.failures(),
      totalCount: this.counter.total(),
      failureRate: this.counter.failureRate(),
      openedAt: state === 'OPEN' ? Date.now() - this.stateMachine.retryAfterMs : null,
      lastFailureAt: this.lastFailureAt,
      nextAttemptAt: state === 'OPEN' ? Date.now() + this.stateMachine.retryAfterMs : null,
    };
  }

  private consecutiveFailures(): number {
    // 通过 counter 事件数组计算连续失败
    let count = 0;
    const events = (this.counter as unknown as { events: Array<{ success: boolean }> }).events;
    for (let i = events.length - 1; i >= 0; i--) {
      if (!events[i].success) {
        count += 1;
      } else {
        break;
      }
    }
    return count;
  }
}
