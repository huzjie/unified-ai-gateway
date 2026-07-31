import type { BreakerState } from '@uag/types';

/**
 * Redis 状态存储（P2）
 * 熔断状态跨实例共享的接口骨架；M1 使用内存实现。
 */
export interface RedisBreakerStoreLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlMs?: number): Promise<void>;
}

export class RedisBreakerStore {
  constructor(private readonly client: RedisBreakerStoreLike) {}

  /** 读取状态 */
  async getState(providerKey: string): Promise<BreakerState | null> {
    const raw = await this.client.get(`uag:cb:${providerKey}`);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw).state as BreakerState;
  }

  /** 保存状态 */
  async setState(providerKey: string, state: BreakerState, ttlMs = 60_000): Promise<void> {
    await this.client.set(`uag:cb:${providerKey}`, JSON.stringify({ state, ts: Date.now() }), ttlMs);
  }
}
