import type { FastifyInstance } from 'fastify';

/**
 * Swagger + UI（/docs）
 */
export function registerSwagger(server: FastifyInstance, _runtime: unknown): void {
  void server.register(require('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'Unified AI Gateway API',
        description: '统一 AI 网关管理 API',
        version: '1.0.0',
      },
      servers: [{ url: 'http://localhost:8787' }],
    },
  });
  void server.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
  });
}
