import type { RuntimeRegistry } from '../services/runtime-registry';

/** (P2) */
export class QuotasController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  get(tenant: string) {
    return this.runtime.repos.quota.get(tenant);
  }
}
