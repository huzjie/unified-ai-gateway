/**
 * 内存数据库实现（Map 集合）
 * 提供与 SQLite 仓储同构的通用集合操作。
 */
export class MemoryCollections {
  /** 通用集合类 */
  static createCollection<T extends { id: string }>(initial: T[] = []): MemoryCollection<T> {
    return new MemoryCollection(initial);
  }
}

export class MemoryCollection<T extends { id: string }> {
  private items = new Map<string, T>();

  constructor(initial: T[] = []) {
    for (const item of initial) {
      this.items.set(item.id, item);
    }
  }

  insert(item: T): T {
    this.items.set(item.id, item);
    return item;
  }

  find(id: string): T | null {
    return this.items.get(id) ?? null;
  }

  findWhere(predicate: (item: T) => boolean): T | null {
    for (const item of this.items.values()) {
      if (predicate(item)) {
        return item;
      }
    }
    return null;
  }

  filter(predicate: (item: T) => boolean): T[] {
    return [...this.items.values()].filter(predicate);
  }

  all(): T[] {
    return [...this.items.values()];
  }

  update(id: string, patch: Partial<T>): T | null {
    const current = this.items.get(id);
    if (!current) {
      return null;
    }
    const updated = { ...current, ...patch };
    this.items.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.items.delete(id);
  }

  count(): number {
    return this.items.size;
  }

  clear(): void {
    this.items.clear();
  }
}

/**
 * 内存数据库（聚合集合）
 */
export class MemoryDatabase {
  readonly collections = {
    providers: MemoryCollections.createCollection<{ id: string }>(),
    apiKeys: MemoryCollections.createCollection<{ id: string }>(),
    routeRules: MemoryCollections.createCollection<{ id: string }>(),
    usageLogs: MemoryCollections.createCollection<{ id: string }>(),
    dailyStats: MemoryCollections.createCollection<{ id: string }>(),
    auditLogs: MemoryCollections.createCollection<{ id: string }>(),
    settings: MemoryCollections.createCollection<{ id: string }>(),
  };

  clear(): void {
    for (const collection of Object.values(this.collections)) {
      collection.clear();
    }
  }
}
