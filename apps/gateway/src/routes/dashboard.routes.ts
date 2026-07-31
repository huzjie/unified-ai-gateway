import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';
import { formatApiResponse } from '../utils/response-formatter';

/** /admin/dashboard */
export function registerDashboardRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.get('/admin/dashboard', { preHandler }, async (request) => {
    const query = request.query as { days?: string };
    const days = query.days ? Number(query.days) : 7;
    return formatApiResponse(runtime.dashboardService.get(Number.isFinite(days) && days > 0 ? days : 7));
  });
}
