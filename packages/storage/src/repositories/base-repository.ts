import type { SQLiteConnection } from '../connection/sqlite-connection';

/**
 * 通用 CRUD 基类
 * 提供表级基础操作封装。
 */
export abstract class BaseRepository {
  constructor(protected readonly conn: SQLiteConnection) {}

  /** 表名（子类实现） */
  protected abstract readonly table: string;

  /** 查询单行 */
  protected findOne<T>(where: string, params: unknown[]): T | null {
    const row = this.conn
      .prepare(`SELECT * FROM ${this.table} WHERE ${where} LIMIT 1`)
      .get(...params);
    return (row as T | undefined) ?? null;
  }

  /** 查询多行 */
  protected findMany<T>(where = '', params: unknown[] = [], extra = ''): T[] {
    const sql = `SELECT * FROM ${this.table} ${where} ${extra}`.trim();
    return this.conn.prepare(sql).all(...params) as T[];
  }

  /** 插入（insertRow 避免与子类公开 insert 方法同名冲突） */
  protected insertRow(table: string, data: Record<string, unknown>): void {
    const keys = Object.keys(data);
    const cols = keys.join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    this.conn
      .prepare(`INSERT INTO ${table} (${cols}) VALUES (${placeholders})`)
      .run(...keys.map((k) => data[k]));
  }

  /** 更新（updateRow 避免与子类公开 update 方法同名冲突） */
  protected updateRow(table: string, id: string, patch: Record<string, unknown>): void {
    const keys = Object.keys(patch);
    if (keys.length === 0) {
      return;
    }
    const sets = keys.map((k) => `${k} = ?`).join(', ');
    this.conn
      .prepare(`UPDATE ${table} SET ${sets} WHERE id = ?`)
      .run(...keys.map((k) => patch[k]), id);
  }

  /** 删除（deleteRow 避免与子类公开 delete 方法同名冲突） */
  protected deleteRow(table: string, id: string): void {
    this.conn.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  }

  /** 计数 */
  protected count(where = '', params: unknown[] = []): number {
    const sql = `SELECT COUNT(*) as cnt FROM ${this.table} ${where}`.trim();
    const row = this.conn.prepare(sql).get(...params) as { cnt: number };
    return row?.cnt ?? 0;
  }

  /** 事务包装 */
  protected transaction<T>(fn: () => T): T {
    return this.conn.transaction(fn);
  }
}
