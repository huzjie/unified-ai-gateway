import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';
import { formatApiResponse } from '../utils/response-formatter';

/** /admin/settings */
export function registerSettingsRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.get('/admin/settings', { preHandler }, async () => {
    return formatApiResponse(runtime.settingsService.get());
  });

  server.put('/admin/settings', { preHandler }, async (request) => {
    const body = request.body as never;
    return formatApiResponse(runtime.settingsService.update(body));
  });
}
