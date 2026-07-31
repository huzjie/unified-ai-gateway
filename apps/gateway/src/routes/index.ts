import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { registerHealthRoutes } from './health.routes';
import { registerChatRoutes } from './chat.routes';
import { registerModelsRoutes } from './models.routes';
import { registerAuthRoutes } from './auth.routes';
import { registerKeysRoutes } from './keys.routes';
import { registerProvidersRoutes } from './providers.routes';
import { registerRoutesRoutes } from './routes.routes';
import { registerLogsRoutes } from './logs.routes';
import { registerStatsRoutes } from './stats.routes';
import { registerSettingsRoutes } from './settings.routes';
import { registerAuditRoutes } from './audit.routes';
import { registerDashboardRoutes } from './dashboard.routes';
import { registerExportRoutes } from './export.routes';
import { registerWebhookRoutes } from './webhook.routes';
import { registerQuotasRoutes } from './quotas.routes';
import { registerCacheRoutes } from './cache.routes';

/**
 * 路由注册表
 */
export function registerRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  runtime.attachServer(server);

  registerHealthRoutes(server, runtime);
  registerChatRoutes(server, runtime);
  registerModelsRoutes(server, runtime);
  registerAuthRoutes(server, runtime);
  registerKeysRoutes(server, runtime);
  registerProvidersRoutes(server, runtime);
  registerRoutesRoutes(server, runtime);
  registerLogsRoutes(server, runtime);
  registerStatsRoutes(server, runtime);
  registerSettingsRoutes(server, runtime);
  registerAuditRoutes(server, runtime);
  registerDashboardRoutes(server, runtime);
  registerExportRoutes(server, runtime);
  registerWebhookRoutes(server, runtime);
  registerQuotasRoutes(server, runtime);
  registerCacheRoutes(server, runtime);
}
