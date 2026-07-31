/**
 * 触发器（updated_at 自动维护）
 */
export const TRIGGERS = `
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

CREATE TRIGGER IF NOT EXISTS trg_daily_stats_updated_at
AFTER UPDATE ON daily_stats
FOR EACH ROW
BEGIN
  UPDATE daily_stats SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_webhooks_updated_at
AFTER UPDATE ON webhooks
FOR EACH ROW
BEGIN
  UPDATE webhooks SET updated_at = datetime('now') WHERE id = OLD.id;
END;
`;
