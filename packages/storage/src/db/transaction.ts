import type { SQLiteConnection } from '../connection/sqlite-connection';

/**
 * 事务包装（withTransaction）
 */
export function withTransaction<T>(conn: SQLiteConnection, fn: () => T): T {
  return conn.transaction(fn);
}
