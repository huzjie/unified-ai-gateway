import type { ProviderAdapter } from '@uag/types';

/**
 * 已注册 Provider 管理（增删查）
 */
export class ProviderRegistry {
  private readonly adapters = new Map<string, ProviderAdapter>();

  /** 注册适配器（按配置名） */
  register(adapter: ProviderAdapter): void {
    this.adapters.set(adapter.name, adapter);
  }

  /** 批量注册 */
  registerAll(adapters: ProviderAdapter[]): void {
    for (const adapter of adapters) {
      this.register(adapter);
    }
  }

  /** 获取适配器（不存在返回 null） */
  get(name: string): ProviderAdapter | null {
    return this.adapters.get(name) ?? null;
  }

  /** 是否存在 */
  has(name: string): boolean {
    return this.adapters.has(name);
  }

  /** 全部适配器 */
  list(): ProviderAdapter[] {
    return [...this.adapters.values()];
  }

  /** 按类型列出 */
  listByType(type: string): ProviderAdapter[] {
    return this.list().filter((a) => a.type === type);
  }

  /** 移除 */
  remove(name: string): boolean {
    return this.adapters.delete(name);
  }

  /** 清空（测试用） */
  clear(): void {
    this.adapters.clear();
  }

  /** 数量 */
  get size(): number {
    return this.adapters.size;
  }
}
