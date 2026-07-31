import type { SettingsPatch, SystemSettings } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';

/**
 * 设置读写 + 热生效
 */
export class SettingsService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  get(): SystemSettings {
    return this.runtime.settings.get();
  }

  update(patch: SettingsPatch): SystemSettings {
    const updated = this.runtime.repos.settings.update(patch);
    this.runtime.settings.replace(updated);
    this.runtime.auditService.record('settings', 'settings.update', 'system', 'success', { fields: Object.keys(patch) });
    return updated;
  }
}
