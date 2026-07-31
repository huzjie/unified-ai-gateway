import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';
import { parsePagination } from '../utils/pagination';
import { formatApiResponse } from '../utils/response-formatter';

/** /admin/providers CRUD */
export function registerProvidersRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.get('/admin/providers', { preHandler }, async (request) => {
    const query = request.query as { type?: string; search?: string; page?: string; pageSize?: string };
    const page = parsePagination(query);
    const result = runtime.providerAdminService.list(
      { type: query.type, search: query.search },
      page,
    );
    return formatApiResponse(result);
  });

  server.post('/admin/providers', { preHandler }, async (request, reply) => {
    const body = request.body as never;
    const result = await runtime.providerAdminService.create(body);
    return reply.status(201).send(formatApiResponse(result));
  });

  server.get('/admin/providers/:id', { preHandler }, async (request) => {
    const { id } = request.params as { id: string };
    return formatApiResponse(runtime.providerAdminService.get(id));
  });

  server.put('/admin/providers/:id', { preHandler }, async (request) => {
    const { id } = request.params as { id: string };
    const body = request.body as never;
    return formatApiResponse(await runtime.providerAdminService.update(id, body));
  });

  server.delete('/admin/providers/:id', { preHandler }, async (request) => {
    const { id } = request.params as { id: string };
    runtime.providerAdminService.remove(id);
    return formatApiResponse({ id, deleted: true });
  });

  server.post('/admin/providers/:id/test', { preHandler }, async (request) => {
    const { id } = request.params as { id: string };
    return formatApiResponse(await runtime.providerAdminService.test(id));
  });
}
