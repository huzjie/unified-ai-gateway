import type { SQLiteConnection } from '../connection/sqlite-connection';
import { ApiKeyRepository } from '../repositories/api-key-repository';
import { ProviderRepository } from '../repositories/provider-repository';
import { RouteRuleRepository } from '../repositories/route-rule-repository';
import { UsageLogRepository } from '../repositories/usage-log-repository';
import { DailyStatsRepository } from '../repositories/daily-stats-repository';
import { SettingsRepository } from '../repositories/settings-repository';
import { AuditLogRepository } from '../repositories/audit-log-repository';
import { ContextCacheRepository } from '../repositories/context-cache-repository';
import { WebhookRepository } from '../repositories/webhook-repository';
import { QuotaRepository } from '../repositories/quota-repository';

/**
 * 仓储组（按 db 类型创建）
 */
export interface RepositoryGroup {
  apiKey: ApiKeyRepository;
  provider: ProviderRepository;
  routeRule: RouteRuleRepository;
  usageLog: UsageLogRepository;
  dailyStats: DailyStatsRepository;
  settings: SettingsRepository;
  auditLog: AuditLogRepository;
  contextCache: ContextCacheRepository;
  webhook: WebhookRepository;
  quota: QuotaRepository;
}

export class RepositoryFactory {
  constructor(private readonly conn: SQLiteConnection) {}

  createGroup(): RepositoryGroup {
    return {
      apiKey: new ApiKeyRepository(this.conn),
      provider: new ProviderRepository(this.conn),
      routeRule: new RouteRuleRepository(this.conn),
      usageLog: new UsageLogRepository(this.conn),
      dailyStats: new DailyStatsRepository(this.conn),
      settings: new SettingsRepository(this.conn),
      auditLog: new AuditLogRepository(this.conn),
      contextCache: new ContextCacheRepository(this.conn),
      webhook: new WebhookRepository(this.conn),
      quota: new QuotaRepository(this.conn),
    };
  }
}
