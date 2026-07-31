import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export interface CliConfig {
  apiUrl?: string;
  token?: string;
  output?: 'json' | 'table';
}

/** .gateway-cli.json */
export function loadCliConfig(): CliConfig {
  const path = join(process.cwd(), '.gateway-cli.json');
  if (!existsSync(path)) {
    return {};
  }
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as CliConfig;
  } catch {
    return {};
  }
}
