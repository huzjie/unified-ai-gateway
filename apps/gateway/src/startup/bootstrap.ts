import { loadConfig } from '../config/load-config';
import { ConfigValidator } from '../config/config-validator';
import { RuntimeRegistry } from '../services/runtime-registry';
import { seedInitialData } from './seed';

/**
 * 启动装配（DB → 仓储 → 核心 → Provider → 路由）
 */
export async function bootstrap(): Promise<RuntimeRegistry> {
  const config = loadConfig();

  // 安全校验（加密密钥/JWT/管理员密码）
  const validator = new ConfigValidator();
  const validated = validator.validate(config);
  validator.assertSafe(validated);

  // 运行时容器
  const runtime = new RuntimeRegistry(config);

  // 从存储加载设置
  const storedSettings = runtime.repos.settings.get();
  runtime.settings.replace(storedSettings);

  // 注册 Provider 适配器
  const providers = runtime.repos.provider.listAll();
  for (const provider of providers) {
    if (provider.enabled === 'enabled') {
      try {
        await runtime.registerProviderAdapter(provider);
      } catch (err) {
        runtime.logger.warn({ provider: provider.name, err }, 'Provider 适配器注册失败');
      }
    }
  }

  // 重载路由规则
  runtime.reloadRouteRules();

  // 初始数据（管理员/默认 Provider/默认规则/默认 Key）
  seedInitialData(runtime);

  runtime.logger.info({ providers: runtime.providers.size }, 'bootstrap complete');
  return runtime;
}
