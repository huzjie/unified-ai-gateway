export interface CliEnv {
  apiUrl: string;
  token: string | null;
  debug: boolean;
}

/** CLI 环境变量解析 */
export function parseEnv(env: Record<string, string | undefined> = process.env): CliEnv {
  return {
    apiUrl: env['GATEWAY_CLI_API_URL'] ?? 'http://localhost:8787',
    token: env['GATEWAY_CLI_TOKEN'] ?? null,
    debug: env['GATEWAY_CLI_DEBUG'] === '1',
  };
}
