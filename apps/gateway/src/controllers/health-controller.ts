import type { RuntimeRegistry } from '../services/runtime-registry';

export class HealthController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  healthz() {
    return { status: 'ok', ts: new Date().toISOString() };
  }

  readyz() {
    return {
      status: 'ok',
      uptimeMs: Date.now() - process.uptime() * 1000,
      version: '1.0.0',
      checks: {
        storage: 'ok',
        providers: String(this.runtime.providers.size),
      },
      ts: new Date().toISOString(),
    };
  }
}
