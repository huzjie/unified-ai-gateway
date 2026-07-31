import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';
import { parsePagination } from '../utils/pagination';
import { formatApiResponse } from '../utils/response-formatter';

/** /admin/routes CRUD */
export function registerRoutesRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.get('/admin/routes', { preHandler }, async (request) => {
    const query = request.query as { search?: string; page?: string; pageSize?: string };
    const page = parsePagination(query);
    return formatApiResponse(runtime.routeAdminService.list({ search: query.search }, page));
  });

  server.post('/admin/routes', { preHandler }, async (request, reply) => {
    const body = request.body as never;
    return reply.status(201).send(formatApiResponse(runtime.routeAdminService.create(body)));
  });

  server.get('/admin/routes/:id', { preHandler }, async (request) => {
    const { id } = request.params as { id: string };
    return formatApiResponse(runtime.routeAdminService.get(id));
  });

  server.put('/admin/routes/:id', { preHandler }, async (request) => {
    const { id } = request.params as { id: string };
    const body = request.body as never;
    return formatApiResponse(runtime.routeAdminService.update(id, body));
  });

  server.delete('/admin/routes/:id', { preHandler }, async (request) => {
    const { id } = request.params as { id: string };
    runtime.routeAdminService.remove(id);
    return formatApiResponse({ id, deleted: true });
  });

  server.post('/admin/routes/dry-run', { preHandler }, async (request) => {
    const body = request.body as { model?: string; tenant?: string };
    return formatApiResponse(runtime.routeAdminService.dryRun(body?.model ?? '', body?.tenant ?? ''));
  });
}
