import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';
import { parsePagination } from '../utils/pagination';
import { formatApiResponse } from '../utils/response-formatter';

/** /admin/keys CRUD */
export function registerKeysRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.get('/admin/keys', { preHandler }, async (request) => {
    const query = request.query as { tenant?: string; status?: string; search?: string; page?: string; pageSize?: string };
    const page = parsePagination(query);
    const result = runtime.keyService.list(
      { tenant: query.tenant, status: query.status as never, search: query.search },
      page,
    );
    return formatApiResponse(result);
  });

  server.post('/admin/keys', { preHandler }, async (request, reply) => {
    const body = request.body as {
      name?: string; tenant?: string; modelWhitelist?: string[]; qpsLimit?: number;
      concurrencyLimit?: number; monthlyQuotaTokens?: number; monthlyQuotaAmount?: number; expiresAt?: string;
    };
    if (!body?.name || !body?.tenant) {
      return reply.status(400).send({ code: 'UAG-5002', message: 'name 与 tenant 必填' });
    }
    const result = runtime.keyService.createKey({
      name: body.name,
      tenant: body.tenant,
      modelWhitelist: body.modelWhitelist ?? [],
      qpsLimit: body.qpsLimit ?? 100,
      concurrencyLimit: body.concurrencyLimit ?? 20,
      monthlyQuotaTokens: body.monthlyQuotaTokens ?? 0,
      monthlyQuotaAmount: body.monthlyQuotaAmount ?? 0,
      expiresAt: body.expiresAt ?? null,
    });
    return reply.status(201).send(formatApiResponse(result, '创建成功（明文仅此一次返回）'));
  });

  server.put('/admin/keys/:id', { preHandler }, async (request) => {
    const { id } = request.params as { id: string };
    const body = request.body as never;
    return formatApiResponse(runtime.keyService.update(id, body));
  });

  server.delete('/admin/keys/:id', { preHandler }, async (request) => {
    const { id } = request.params as { id: string };
    runtime.keyService.revoke(id);
    return formatApiResponse({ id, revoked: true });
  });
}
