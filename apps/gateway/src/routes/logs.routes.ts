import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';
import { parsePagination } from '../utils/pagination';
import { formatApiResponse } from '../utils/response-formatter';

/** /admin/logs 查询 */
export function registerLogsRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.get('/admin/logs', { preHandler }, async (request) => {
    const query = request.query as {
      keyId?: string; tenant?: string; model?: string; provider?: string; statusCode?: string;
      search?: string; startTime?: string; endTime?: string; page?: string; pageSize?: string;
    };
    const page = parsePagination(query);
    const result = runtime.logService.query(
      {
        keyId: query.keyId,
        tenant: query.tenant,
        model: query.model,
        provider: query.provider,
        statusCode: query.statusCode ? Number(query.statusCode) : undefined,
        search: query.search,
        startTime: query.startTime,
        endTime: query.endTime,
      },
      page,
    );
    return formatApiResponse(result);
  });

  server.get('/admin/logs/:id', { preHandler }, async (request) => {
    const { id } = request.params as { id: string };
    return formatApiResponse(runtime.logService.get(id));
  });
}
