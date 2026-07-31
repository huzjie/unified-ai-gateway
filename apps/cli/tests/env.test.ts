import { parseEnv } from '../src/config/env';

describe('cli env', () => {
  it('默认值', () => {
    const env = parseEnv({});
    expect(env.apiUrl).toBe('http://localhost:8787');
    expect(env.token).toBeNull();
    expect(env.debug).toBe(false);
  });

  it('环境变量覆盖', () => {
    const env = parseEnv({ GATEWAY_CLI_API_URL: 'http://x', GATEWAY_CLI_TOKEN: 't', GATEWAY_CLI_DEBUG: '1' });
    expect(env.apiUrl).toBe('http://x');
    expect(env.token).toBe('t');
    expect(env.debug).toBe(true);
  });
});
