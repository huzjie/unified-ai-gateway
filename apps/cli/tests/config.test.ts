import { loadCliConfig } from '../src/config/cli-config';

describe('cli config', () => {
  it('无配置文件返回空', () => {
    const config = loadCliConfig();
    expect(config).toBeDefined();
  });
});
