import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';
import { formatApiResponse } from '../utils/response-formatter';

/** /admin/cache（P1） */
export function registerCacheRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.delete('/admin/cache', { preHandler }, async () => {
    const deleted = runtime.repos.contextCache.deleteExpired();
    return formatApiResponse({ deleted });
  });
}
