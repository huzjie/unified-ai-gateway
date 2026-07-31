import type { RuntimeRegistry } from '../services/runtime-registry';

export class SettingsController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  get() {
    return this.runtime.settingsService.get();
  }

  update(body: Record<string, unknown>) {
    return this.runtime.settingsService.update(body as never);
  }
}
