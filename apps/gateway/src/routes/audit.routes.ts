import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';
import { parsePagination } from '../utils/pagination';
import { formatApiResponse } from '../utils/response-formatter';

/** /admin/audit */
export function registerAuditRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.get('/admin/audit', { preHandler }, async (request) => {
    const query = request.query as {
      actorId?: string; action?: string; resourceType?: string; result?: string;
      startTime?: string; endTime?: string; page?: string; pageSize?: string;
    };
    const page = parsePagination(query);
    const result = runtime.auditService.query(
      {
        actorId: query.actorId,
        action: query.action,
        resourceType: query.resourceType,
        result: query.result as 'success' | 'failure' | undefined,
        startTime: query.startTime,
        endTime: query.endTime,
      },
      page,
    );
    return formatApiResponse(result);
  });
}
