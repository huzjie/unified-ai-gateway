-- 002_add_usage_logs.sql: usage_logs + 索引
CREATE TABLE IF NOT EXISTS usage_logs (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  key_id TEXT,
  tenant TEXT NOT NULL,
  model TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_model TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  latency_ms INTEGER NOT NULL DEFAULT 0,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  cost_amount REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'CNY',
  stream INTEGER NOT NULL DEFAULT 0,
  cache_hit INTEGER NOT NULL DEFAULT 0,
  error_code TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_logs_created ON usage_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_logs_key_created ON usage_logs (key_id, created_at);
CREATE INDEX IF NOT EXISTS idx_logs_model_created ON usage_logs (model, created_at);
CREATE INDEX IF NOT EXISTS idx_logs_provider_created ON usage_logs (provider, created_at);
