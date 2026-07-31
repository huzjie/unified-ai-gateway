import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';

/** /healthz /readyz */
export function registerHealthRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  server.get('/healthz', async () => ({
    status: 'ok',
    ts: new Date().toISOString(),
  }));

  server.get('/readyz', async () => ({
    status: 'ok',
    uptimeMs: Date.now() - process.uptime() * 1000,
    version: '1.0.0',
    checks: {
      storage: 'ok',
      providers: String(runtime.providers.size),
      rules: String(runtime.repos.routeRule.listEnabled().length),
    },
    ts: new Date().toISOString(),
  }));
}
