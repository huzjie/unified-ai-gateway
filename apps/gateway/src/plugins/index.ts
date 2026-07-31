import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { registerJwt } from './jwt-plugin';
import { registerCors } from './cors-plugin';
import { registerHelmet } from './helmet-plugin';
import { registerSensible } from './sensible-plugin';
import { registerRequestId } from './request-id-plugin';
import { registerErrorPlugin } from './error-plugin';
import { registerSwagger } from './swagger-plugin';
import { registerCompression } from './compression-plugin';

/**
 * 插件注册顺序
 */
export function registerPlugins(server: FastifyInstance, runtime: RuntimeRegistry): void {
  registerSensible(server);
  registerHelmet(server, runtime);
  registerCors(server, runtime);
  registerRequestId(server);
  registerJwt(server, runtime);
  registerErrorPlugin(server, runtime);
  registerCompression(server);
  registerSwagger(server, runtime);
}
