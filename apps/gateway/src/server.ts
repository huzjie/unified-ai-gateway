import Fastify, { type FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from './services/runtime-registry';
import { registerPlugins } from './plugins';
import { registerRoutes } from './routes';

/**
 * Fastify 实例创建与监听（buildApp 供测试注入依赖）
 */
export function buildServer(runtime: RuntimeRegistry): FastifyInstance {
  const server = Fastify({
    loggerInstance: runtime.logger as never,
    trustProxy: true,
    bodyLimit: 10 * 1024 * 1024, // 10MB
  }) as unknown as FastifyInstance;

  // 注册插件
  registerPlugins(server, runtime);

  // 注册路由
  registerRoutes(server, runtime);

  return server;
}

export { buildServer as buildApp };
