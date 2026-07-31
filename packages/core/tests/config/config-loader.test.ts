import { ConfigLoader } from '../../src/config';
import { DEFAULTS } from '../../src/config';

describe('ConfigLoader', () => {
  it('默认配置', () => {
    const loader = new ConfigLoader();
    const config = loader.load({});
    expect(config.server.port).toBe(DEFAULTS.gateway.server.port);
    expect(config.server.host).toBe('0.0.0.0');
    expect(config.rateLimit.globalQps).toBe(1000);
    expect(config.mockProviderEnabled).toBe(true);
  });

  it('环境变量覆盖默认值', () => {
    const loader = new ConfigLoader();
    const config = loader.load({
      UAG_PORT: '9999',
      UAG_GLOBAL_QPS: '500',
      UAG_ADMIN_USERNAME: 'root',
    });
    expect(config.server.port).toBe(9999);
    expect(config.rateLimit.globalQps).toBe(500);
    expect(config.admin.username).toBe('root');
  });

  it('配置文件合并', () => {
    const loader = new ConfigLoader();
    const config = loader.load(
      { UAG_PORT: '8788' },
      {
        rateLimit: { globalQps: 800 },
        aliases: { 'my-main': ['moonshot'] },
      },
    );
    expect(config.server.port).toBe(8788);
    expect(config.rateLimit.globalQps).toBe(800);
    expect(config.aliases?.['my-main']).toEqual(['moonshot']);
  });

  it('无效环境变量回退默认', () => {
    const loader = new ConfigLoader();
    const config = loader.load({ UAG_PORT: 'abc' });
    expect(config.server.port).toBe(8787);
  });
});
