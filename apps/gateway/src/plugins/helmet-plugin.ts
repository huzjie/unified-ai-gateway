import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * 安全头
 */
export function registerHelmet(server: FastifyInstance, _runtime: RuntimeRegistry): void {
  void server.register(require('@fastify/helmet'), {
    contentSecurityPolicy: false,
  });
}
