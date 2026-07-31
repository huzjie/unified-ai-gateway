import { MemoryDatabase } from './memory-database';

/**
 * 内存仓储工厂
 * 说明：M1 默认 better-sqlite3；内存 fallback 提供同构接口骨架，
 * 供无盘模式与测试使用。
 */
export class MemoryRepositoryFactory {
  constructor(private readonly db: MemoryDatabase = new MemoryDatabase()) {}

  /** 清空全部 */
  clear(): void {
    this.db.clear();
  }
}
