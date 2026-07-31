import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';
import { formatApiResponse } from '../utils/response-formatter';

/** /admin/webhooks（P2） */
export function registerWebhookRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.get('/admin/webhooks', { preHandler }, async () => {
    return formatApiResponse(runtime.repos.webhook.listEnabled());
  });

  server.post('/admin/webhooks', { preHandler }, async (request, reply) => {
    const body = request.body as { name?: string; url?: string; secret?: string; events?: string[] };
    if (!body?.name || !body?.url || !body?.secret) {
      return reply.status(400).send({ code: 'UAG-5002', message: 'name/url/secret 必填' });
    }
    const webhook = runtime.repos.webhook.create({
      name: body.name,
      url: body.url,
      secret: body.secret,
      events: (body.events ?? []) as never,
    });
    return reply.status(201).send(formatApiResponse(webhook));
  });
}
