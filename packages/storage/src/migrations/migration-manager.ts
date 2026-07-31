import type { SQLiteConnection } from '../connection/sqlite-connection';

/**
 * 迁移执行器（版本表 + 事务）
 */
export interface Migration {
  version: number;
  name: string;
  up: string;
}

export class MigrationManager {
  constructor(private readonly connection: SQLiteConnection) {}

  /** 获取已应用版本 */
  getAppliedVersions(): number[] {
    this.connection.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        applied_at TEXT NOT NULL
      )
    `);
    const rows = this.connection.prepare('SELECT version FROM schema_migrations ORDER BY version').all() as Array<{ version: number }>;
    return rows.map((r) => r.version);
  }

  /** 执行迁移（幂等） */
  migrate(migrations: Migration[]): void {
    const applied = new Set(this.getAppliedVersions());
    const pending = migrations
      .filter((m) => !applied.has(m.version))
      .sort((a, b) => a.version - b.version);

    for (const migration of pending) {
      this.connection.transaction(() => {
        this.connection.exec(migration.up);
        this.connection
          .prepare('INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)')
          .run(migration.version, new Date().toISOString());
      });
    }
  }

  /** 当前最新版本 */
  getLatestVersion(migrations: Migration[]): number {
    return migrations.reduce((max, m) => Math.max(max, m.version), 0);
  }
}
