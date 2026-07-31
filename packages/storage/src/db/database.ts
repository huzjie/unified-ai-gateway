import type { SQLiteConnection } from '../connection/sqlite-connection';
import { MigrationManager, type Migration } from '../migrations/migration-manager';

/**
 * 迁移 SQL（内联，保证编译/打包可运行）
 */
const MIGRATION_SQL: string[] = [
  // 1: initial_schema
  `
CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, type TEXT NOT NULL, base_url TEXT NOT NULL,
  encrypted_api_key TEXT, models_json TEXT NOT NULL DEFAULT '[]', pricing_json TEXT NOT NULL DEFAULT '{}',
  timeout_ms INTEGER NOT NULL DEFAULT 30000, max_retries INTEGER NOT NULL DEFAULT 2,
  enabled INTEGER NOT NULL DEFAULT 1, health_status TEXT NOT NULL DEFAULT 'unknown',
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, tenant TEXT NOT NULL, key_hash TEXT NOT NULL UNIQUE,
  salt TEXT NOT NULL, key_prefix TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active',
  model_whitelist_json TEXT NOT NULL DEFAULT '[]', qps_limit INTEGER NOT NULL DEFAULT 100,
  concurrency_limit INTEGER NOT NULL DEFAULT 20, monthly_quota_tokens INTEGER NOT NULL DEFAULT 0,
  monthly_quota_amount REAL NOT NULL DEFAULT 0, expires_at TEXT, created_at TEXT NOT NULL,
  last_used_at TEXT, revoked_at TEXT
);
CREATE TABLE IF NOT EXISTS route_rules (
  id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, priority INTEGER NOT NULL DEFAULT 100,
  match_model TEXT, match_tenant TEXT, strategy TEXT NOT NULL DEFAULT 'priority',
  targets_json TEXT NOT NULL DEFAULT '[]', fallback_targets_json TEXT NOT NULL DEFAULT '[]',
  breaker_threshold REAL NOT NULL DEFAULT 0.5, enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY, value_json TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_providers_enabled ON providers (enabled);
CREATE INDEX IF NOT EXISTS idx_providers_type ON providers (type);
CREATE INDEX IF NOT EXISTS idx_keys_tenant ON api_keys (tenant);
CREATE INDEX IF NOT EXISTS idx_keys_status ON api_keys (status);
CREATE INDEX IF NOT EXISTS idx_rules_enabled_priority ON route_rules (enabled, priority);
`,
  // 2: usage_logs
  `
CREATE TABLE IF NOT EXISTS usage_logs (
  id TEXT PRIMARY KEY, request_id TEXT NOT NULL, key_id TEXT, tenant TEXT NOT NULL,
  model TEXT NOT NULL, provider TEXT NOT NULL, provider_model TEXT NOT NULL,
  status_code INTEGER NOT NULL, latency_ms INTEGER NOT NULL DEFAULT 0,
  prompt_tokens INTEGER NOT NULL DEFAULT 0, completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0, cost_amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'CNY', stream INTEGER NOT NULL DEFAULT 0,
  cache_hit INTEGER NOT NULL DEFAULT 0, error_code TEXT, error_message TEXT, created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_logs_created ON usage_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_logs_key_created ON usage_logs (key_id, created_at);
CREATE INDEX IF NOT EXISTS idx_logs_model_created ON usage_logs (model, created_at);
CREATE INDEX IF NOT EXISTS idx_logs_provider_created ON usage_logs (provider, created_at);
`,
  // 3: daily_stats
  `
CREATE TABLE IF NOT EXISTS daily_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT, stat_date TEXT NOT NULL, key_id TEXT, model TEXT NOT NULL,
  provider TEXT NOT NULL, request_count INTEGER NOT NULL DEFAULT 0, success_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0, rate_limited_count INTEGER NOT NULL DEFAULT 0,
  prompt_tokens INTEGER NOT NULL DEFAULT 0, completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0, cost_amount REAL NOT NULL DEFAULT 0,
  avg_latency_ms REAL NOT NULL DEFAULT 0, p95_latency_ms REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_daily ON daily_stats (stat_date, key_id, model, provider);
CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_stats (stat_date);
`,
  // 4: audit_logs
  `
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY, actor_type TEXT NOT NULL, actor_id TEXT NOT NULL, action TEXT NOT NULL,
  resource_type TEXT NOT NULL, resource_id TEXT, detail_json TEXT, ip TEXT, user_agent TEXT,
  result TEXT NOT NULL DEFAULT 'success', created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs (actor_id);
`,
  // 5: context_cache
  `
CREATE TABLE IF NOT EXISTS context_cache (
  id TEXT PRIMARY KEY, cache_key TEXT NOT NULL UNIQUE, model TEXT NOT NULL,
  response_json TEXT NOT NULL, prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0, hits INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL, expires_at TEXT, last_hit_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON context_cache (expires_at);
`,
  // 6: webhooks
  `
CREATE TABLE IF NOT EXISTS webhooks (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, url TEXT NOT NULL, secret TEXT NOT NULL,
  events_json TEXT NOT NULL DEFAULT '[]', enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
`,
  // 7: quota_usage
  `
CREATE TABLE IF NOT EXISTS quota_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant TEXT NOT NULL, period TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0, amount_used REAL NOT NULL DEFAULT 0, updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_quota ON quota_usage (tenant, period);
`,
  // 8: route_rule_index
  `
CREATE INDEX IF NOT EXISTS idx_rules_model ON route_rules (match_model);
CREATE INDEX IF NOT EXISTS idx_rules_tenant ON route_rules (match_tenant);
`,
  // 9: trigger_indexes
  `
CREATE TRIGGER IF NOT EXISTS trg_providers_updated_at AFTER UPDATE ON providers FOR EACH ROW
BEGIN UPDATE providers SET updated_at = datetime('now') WHERE id = OLD.id; END;
CREATE TRIGGER IF NOT EXISTS trg_route_rules_updated_at AFTER UPDATE ON route_rules FOR EACH ROW
BEGIN UPDATE route_rules SET updated_at = datetime('now') WHERE id = OLD.id; END;
CREATE INDEX IF NOT EXISTS idx_logs_status ON usage_logs (status_code);
CREATE INDEX IF NOT EXISTS idx_logs_request ON usage_logs (request_id);
`,
];

/** 迁移列表（顺序执行） */
export const MIGRATIONS: Migration[] = MIGRATION_SQL.map((sql, index) => ({
  version: index + 1,
  name: `migration_${index + 1}`,
  up: sql,
}));

/**
 * 数据库门面（连接 + 迁移 + 事务）
 */
export class Database {
  private readonly manager: MigrationManager;

  constructor(
    readonly connection: SQLiteConnection,
    migrations: Migration[] = MIGRATIONS,
  ) {
    this.manager = new MigrationManager(connection);
    this.manager.migrate(migrations);
  }

  /** 当前版本 */
  version(): number {
    return this.manager.getLatestVersion(MIGRATIONS);
  }

  /** 事务 */
  transaction<T>(fn: () => T): T {
    return this.connection.transaction(fn);
  }

  /** 关闭 */
  close(): void {
    this.connection.close();
  }
}
