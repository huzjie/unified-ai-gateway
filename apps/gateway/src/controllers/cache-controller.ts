import type { RuntimeRegistry } from '../services/runtime-registry';

/** (P1) */
export class CacheController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  clearExpired() {
    return { deleted: this.runtime.repos.contextCache.deleteExpired() };
  }
}
