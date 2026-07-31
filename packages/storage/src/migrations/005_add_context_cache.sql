-- 005_add_context_cache.sql: context_cache（P1）
CREATE TABLE IF NOT EXISTS context_cache (
  id TEXT PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  model TEXT NOT NULL,
  response_json TEXT NOT NULL,
  prompt_tokens INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  hits INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  expires_at TEXT,
  last_hit_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_cache_expires ON context_cache (expires_at);
