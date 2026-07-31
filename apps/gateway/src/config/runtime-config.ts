import type { SettingsPatch, SystemSettings } from '@uag/types';

/**
 * 运行时可变配置（设置页热更新）
 */
export class RuntimeConfig {
  private settings: SystemSettings;

  constructor(initial: SystemSettings) {
    this.settings = initial;
  }

  /** 当前设置 */
  get(): SystemSettings {
    return this.settings;
  }

  /** 热更新 */
  update(patch: SettingsPatch): SystemSettings {
    this.settings = { ...this.settings, ...patch, updatedAt: new Date().toISOString() };
    return this.settings;
  }

  /** 覆盖全量（从存储加载） */
  replace(settings: SystemSettings): void {
    this.settings = settings;
  }
}
