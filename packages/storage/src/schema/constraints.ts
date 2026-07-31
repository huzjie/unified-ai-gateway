/**
 * 唯一约束/外键定义
 * 说明：外键在连接层启用（foreign_keys = ON），业务表通过逻辑外键关联（key_id → api_keys.id 等）。
 */
export const CONSTRAINTS = `
CREATE UNIQUE INDEX IF NOT EXISTS idx_keys_key_hash ON api_keys (key_hash);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_daily ON daily_stats (stat_date, key_id, model, provider);
CREATE UNIQUE INDEX IF NOT EXISTS uniq_quota ON quota_usage (tenant, period);
CREATE UNIQUE INDEX IF NOT EXISTS idx_cache_key ON context_cache (cache_key);
`;
