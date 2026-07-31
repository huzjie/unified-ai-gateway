import type { SettingsPatch, SystemSettings } from '@uag/types';
import { DEFAULT_SETTINGS } from '@uag/types';
import type { SQLiteConnection } from '../connection/sqlite-connection';
import { BaseRepository } from './base-repository';
import type { ISettingsRepository } from './interfaces/settings-repository.interface';
import { Serializer } from '../services/serializer';

interface SettingsRow {
  key: string;
  value_json: string;
  updated_at: string;
}

/**
 * 设置 KV 仓储
 * settings 表以 key 为行（'system' 存整份系统设置）。
 */
export class SettingsRepository extends BaseRepository implements ISettingsRepository {
  protected readonly table = 'settings';
  private readonly SETTINGS_KEY = 'system';

  constructor(conn: SQLiteConnection) {
    super(conn);
  }

  get(): SystemSettings {
    const row = this.findOne<SettingsRow>('key = ?', [this.SETTINGS_KEY]);
    if (!row) {
      return { ...DEFAULT_SETTINGS, updatedAt: new Date().toISOString() };
    }
    const value = Serializer.record(row.value_json) as unknown as Partial<SystemSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...value,
      updatedAt: row.updated_at,
    };
  }

  update(patch: SettingsPatch): SystemSettings {
    const current = this.get();
    const merged: SystemSettings = { ...current, ...patch, updatedAt: new Date().toISOString() };
    this.conn
      .prepare(`
        INSERT INTO settings (key, value_json, updated_at) VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at
      `)
      .run(this.SETTINGS_KEY, Serializer.serialize(merged), merged.updatedAt);
    return merged;
  }

  /** 读取任意 KV */
  getRaw(key: string): string | null {
    const row = this.findOne<SettingsRow>('key = ?', [key]);
    return row?.value_json ?? null;
  }

  /** 写入任意 KV */
  setRaw(key: string, value: unknown): void {
    this.conn
      .prepare(`
        INSERT INTO settings (key, value_json, updated_at) VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = excluded.updated_at
      `)
      .run(key, Serializer.serialize(value), new Date().toISOString());
  }
}
