-- 008_add_route_rule_index.sql: 路由规则查询索引
CREATE INDEX IF NOT EXISTS idx_rules_enabled_priority ON route_rules (enabled, priority);
CREATE INDEX IF NOT EXISTS idx_rules_model ON route_rules (match_model);
CREATE INDEX IF NOT EXISTS idx_rules_tenant ON route_rules (match_tenant);
