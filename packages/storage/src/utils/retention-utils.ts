import type { SQLiteConnection } from '../connection/sqlite-connection';

/**
 * 日志保留清理
 * 删除早于保留期的 usage_logs 与 audit_logs。
 */
export class RetentionUtils {
  constructor(private readonly conn: SQLiteConnection) {}

  /** 执行清理，返回删除数 */
  cleanup(retentionDays: number): { usageLogs: number; auditLogs: number } {
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000).toISOString();
    const usageLogs = this.conn
      .prepare(`DELETE FROM usage_logs WHERE created_at < ?`)
      .run(cutoff).changes;
    const auditLogs = this.conn
      .prepare(`DELETE FROM audit_logs WHERE created_at < ?`)
      .run(cutoff).changes;
    return { usageLogs, auditLogs };
  }
}
