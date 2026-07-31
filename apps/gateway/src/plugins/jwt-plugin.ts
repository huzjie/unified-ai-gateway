import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * @fastify/jwt 配置
 */
export function registerJwt(server: FastifyInstance, runtime: RuntimeRegistry): void {
  void server.register(require('@fastify/jwt'), {
    secret: runtime.config.jwtSecret,
    sign: {
      expiresIn: '8h',
    },
  });
}
