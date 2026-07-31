-- 007_add_quota_usage.sql: quota_usage（P2）
CREATE TABLE IF NOT EXISTS quota_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant TEXT NOT NULL,
  period TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  amount_used REAL NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_quota ON quota_usage (tenant, period);
