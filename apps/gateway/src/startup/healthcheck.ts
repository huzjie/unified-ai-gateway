import type { RuntimeRegistry } from '../services/runtime-registry';

/**
 * 就绪探针
 */
export function createHealthcheck(runtime: RuntimeRegistry) {
  return () => {
    return {
      status: 'ok',
      uptimeMs: Date.now() - process.uptime() * 1000,
      version: '1.0.0',
      checks: {
        storage: 'ok',
        providers: String(runtime.providers.size),
        rules: String(runtime.repos.routeRule.listEnabled().length),
      },
      ts: new Date().toISOString(),
    };
  };
}
