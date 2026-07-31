import Database from 'better-sqlite3';
import type { Database as DatabaseType, Statement } from 'better-sqlite3';

/**
 * better-sqlite3 连接封装（WAL、外键）
 */
export class SQLiteConnection {
  readonly db: DatabaseType;

  constructor(path: string) {
    this.db = new Database(path);
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('busy_timeout = 5000');
  }

  /** 执行 SQL（无返回） */
  exec(sql: string): void {
    this.db.exec(sql);
  }

  /** 准备语句 */
  prepare(sql: string): Statement {
    return this.db.prepare(sql);
  }

  /** 事务 */
  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)();
  }

  /** 关闭连接 */
  close(): void {
    this.db.close();
  }
}
