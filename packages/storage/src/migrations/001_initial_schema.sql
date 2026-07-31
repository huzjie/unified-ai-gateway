-- 001_initial_schema.sql: providers / api_keys / route_rules / settings
CREATE TABLE IF NOT EXISTS providers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  base_url TEXT NOT NULL,
  encrypted_api_key TEXT,
  models_json TEXT NOT NULL DEFAULT '[]',
  pricing_json TEXT NOT NULL DEFAULT '{}',
  timeout_ms INTEGER NOT NULL DEFAULT 30000,
  max_retries INTEGER NOT NULL DEFAULT 2,
  enabled INTEGER NOT NULL DEFAULT 1,
  health_status TEXT NOT NULL DEFAULT 'unknown',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tenant TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  salt TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  model_whitelist_json TEXT NOT NULL DEFAULT '[]',
  qps_limit INTEGER NOT NULL DEFAULT 100,
  concurrency_limit INTEGER NOT NULL DEFAULT 20,
  monthly_quota_tokens INTEGER NOT NULL DEFAULT 0,
  monthly_quota_amount REAL NOT NULL DEFAULT 0,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  last_used_at TEXT,
  revoked_at TEXT
);

CREATE TABLE IF NOT EXISTS route_rules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  priority INTEGER NOT NULL DEFAULT 100,
  match_model TEXT,
  match_tenant TEXT,
  strategy TEXT NOT NULL DEFAULT 'priority',
  targets_json TEXT NOT NULL DEFAULT '[]',
  fallback_targets_json TEXT NOT NULL DEFAULT '[]',
  breaker_threshold REAL NOT NULL DEFAULT 0.5,
  enabled INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_providers_enabled ON providers (enabled);
CREATE INDEX IF NOT EXISTS idx_providers_type ON providers (type);
CREATE INDEX IF NOT EXISTS idx_keys_tenant ON api_keys (tenant);
CREATE INDEX IF NOT EXISTS idx_keys_status ON api_keys (status);
CREATE INDEX IF NOT EXISTS idx_rules_enabled_priority ON route_rules (enabled, priority);
