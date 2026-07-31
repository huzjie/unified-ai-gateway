/**
 * 内存计数存储
 * 提供限流器共享的计数存储（含 TTL 清理）。
 */
export class MemoryStore {
  private readonly data = new Map<string, { value: unknown; expiresAt: number | null }>();

  /** 自增并返回新值（expiresAt 相对 ms） */
  incr(key: string, by = 1, ttlMs?: number): number {
    this.prune();
    const entry = this.data.get(key);
    const current = typeof entry?.value === 'number' ? (entry.value as number) : 0;
    const next = current + by;
    this.data.set(key, {
      value: next,
      expiresAt: ttlMs ? Date.now() + ttlMs : null,
    });
    return next;
  }

  /** 设置值（expiresAtMs 相对 ms，与 incr 的 ttlMs 语义一致） */
  set(key: string, value: unknown, expiresAtMs?: number): void {
    this.data.set(key, { value, expiresAt: expiresAtMs ? Date.now() + expiresAtMs : null });
  }

  /** 获取值 */
  get<T>(key: string): T | undefined {
    this.prune();
    const entry = this.data.get(key);
    return entry ? (entry.value as T) : undefined;
  }

  /** 删除 */
  delete(key: string): boolean {
    return this.data.delete(key);
  }

  /** 按前缀删除 */
  deletePrefix(prefix: string): void {
    for (const key of this.data.keys()) {
      if (key.startsWith(prefix)) {
        this.data.delete(key);
      }
    }
  }

  /** 清理过期条目 */
  prune(): void {
    const now = Date.now();
    for (const [key, entry] of this.data.entries()) {
      if (entry.expiresAt !== null && entry.expiresAt <= now) {
        this.data.delete(key);
      }
    }
  }

  /** 条目数（测试用） */
  get size(): number {
    this.prune();
    return this.data.size;
  }

  /** 清空（测试用） */
  clear(): void {
    this.data.clear();
  }
}
