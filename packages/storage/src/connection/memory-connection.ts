import { SQLiteConnection } from './sqlite-connection';

/** 创建 :memory: 连接（测试/无盘模式） */
export function createMemoryConnection(): SQLiteConnection {
  return new SQLiteConnection(':memory:');
}
