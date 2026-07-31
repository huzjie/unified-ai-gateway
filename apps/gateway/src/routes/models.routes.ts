import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createApiKeyAuth } from '../middleware/api-key-auth';

/** GET /v1/models */
export function registerModelsRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  server.get('/v1/models', {
    preHandler: [createApiKeyAuth(runtime)],
  }, async () => {
    const models = await runtime.modelCatalogService.list();
    return { object: 'list', data: models };
  });
}
