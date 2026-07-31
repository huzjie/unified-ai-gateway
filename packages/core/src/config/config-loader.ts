import type { ConfigFileSchema, GatewayConfig } from '@uag/types';
import { parseEnvExplicit, type EnvVars } from './env-config';
import { DEFAULTS } from './defaults';
import { deepMerge } from '../utils/object';

/**
 * 配置加载（env + config 文件合并）
 * 优先级：默认值 < 配置文件 < 仅显式设置的环境变量
 */
export class ConfigLoader {
  /** 从环境变量 + 配置文件加载总配置 */
  load(env: EnvVars = process.env, configFile?: ConfigFileSchema): GatewayConfig {
    // 仅合并显式设置的环境变量，避免未设置的环境变量以默认值覆盖配置文件
    const parsed = parseEnvExplicit(env);
    const fileConfig = configFile ?? {};

    const merged = deepMerge(
      DEFAULTS.gateway as unknown as Record<string, unknown>,
      fileConfig as unknown as Record<string, unknown>,
      parsed as unknown as Record<string, unknown>,
    );

    return merged as unknown as GatewayConfig;
  }

  /** 从配置文件路径加载（JSON/YAML） */
  loadFromFile(path: string, env: EnvVars = process.env): GatewayConfig {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('node:fs');
    const content = fs.readFileSync(path, 'utf-8');
    let fileConfig: ConfigFileSchema;
    if (path.endsWith('.json')) {
      fileConfig = JSON.parse(content);
    } else {
      // 简易 YAML 解析（生产建议使用 yaml 包；此处仅支持简单键值）
      fileConfig = this.parseSimpleYaml(content);
    }
    return this.load(env, fileConfig);
  }

  /** 简易 YAML 解析（仅用于配置骨架） */
  private parseSimpleYaml(content: string): ConfigFileSchema {
    const result: Record<string, unknown> = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('-')) {
        continue;
      }
      const idx = trimmed.indexOf(':');
      if (idx <= 0) {
        continue;
      }
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      result[key] = value;
    }
    return result as ConfigFileSchema;
  }
}
