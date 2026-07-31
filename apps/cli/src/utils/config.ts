import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface CliConfig {
  apiUrl?: string;
  token?: string;
  output?: 'json' | 'table';
}

/** CLI 配置文件读取（.gateway-cli.json in cwd） */
export function loadCliConfig(): CliConfig {
  const candidates = [
    join(process.cwd(), '.gateway-cli.json'),
    join(process.cwd(), '.gateway-cli.jsonc'),
  ];
  for (const path of candidates) {
    if (existsSync(path)) {
      try {
        return JSON.parse(readFileSync(path, 'utf-8')) as CliConfig;
      } catch {
        return {};
      }
    }
  }
  return {};
}
