-- 009_add_trigger_indexes.sql: 触发器与补充索引
CREATE TRIGGER IF NOT EXISTS trg_providers_updated_at
AFTER UPDATE ON providers
FOR EACH ROW
BEGIN
  UPDATE providers SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_route_rules_updated_at
AFTER UPDATE ON route_rules
FOR EACH ROW
BEGIN
  UPDATE route_rules SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE INDEX IF NOT EXISTS idx_logs_status ON usage_logs (status_code);
CREATE INDEX IF NOT EXISTS idx_logs_request ON usage_logs (request_id);
