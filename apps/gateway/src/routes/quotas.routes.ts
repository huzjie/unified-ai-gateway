import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';
import { formatApiResponse } from '../utils/response-formatter';

/** /admin/quotas（P2） */
export function registerQuotasRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.get('/admin/quotas', { preHandler }, async (request) => {
    const query = request.query as { tenant?: string };
    const tenant = query.tenant ?? 'demo';
    return formatApiResponse(runtime.repos.quota.get(tenant));
  });
}
