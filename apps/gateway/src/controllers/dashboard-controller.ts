import type { RuntimeRegistry } from '../services/runtime-registry';

export class DashboardController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  get(days = 7) {
    return this.runtime.dashboardService.get(days);
  }
}
