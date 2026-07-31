import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * CORS 配置
 */
export function registerCors(server: FastifyInstance, runtime: RuntimeRegistry): void {
  void server.register(require('@fastify/cors'), {
    origin: [runtime.config.webOrigin, 'http://localhost:5173', 'http://localhost:8787'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
  });
}
