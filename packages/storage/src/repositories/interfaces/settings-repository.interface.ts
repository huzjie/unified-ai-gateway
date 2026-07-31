import type { SettingsPatch, SystemSettings } from '@uag/types';

export interface ISettingsRepository {
  get(): SystemSettings;
  update(patch: SettingsPatch): SystemSettings;
  getRaw(key: string): string | null;
  setRaw(key: string, value: unknown): void;
}
