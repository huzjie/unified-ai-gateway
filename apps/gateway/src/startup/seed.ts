import type { RuntimeRegistry } from '../services/runtime-registry';
import { KeyHasher, KeyGenerator } from '@uag/storage';

/**
 * 初始数据（.env 管理员/默认 Provider/默认规则/默认 Key）
 */
export function seedInitialData(runtime: RuntimeRegistry): void {
  // 1. 默认 Mock Provider（若启用了 mock 且无任何 Provider）
  if (runtime.config.mockProviderEnabled) {
    const existing = runtime.repos.provider.findByName('mock');
    if (!existing) {
      const entity = runtime.repos.provider.create({
        name: 'mock',
        type: 'mock',
        baseUrl: 'mock://local',
        encryptedApiKey: null,
        models: ['mock-all', 'mock-chat', 'mock-stream'],
        pricing: {},
        enabled: 'enabled',
      });
      runtime.registerProviderAdapter(entity).catch(() => undefined);
    } else if (existing.enabled === 'enabled') {
      runtime.registerProviderAdapter(existing).catch(() => undefined);
    }
  }

  // 2. 默认路由规则（未配置任何规则时）
  const rules = runtime.repos.routeRule.list({}, { page: 1, pageSize: 1 });
  if (rules.total === 0 && runtime.providers.size > 0) {
    const targets = runtime.providers.list().map((p) => p.name);
    if (targets.length > 0) {
      runtime.repos.routeRule.create({
        name: 'default',
        priority: 100,
        matchModel: null,
        matchTenant: null,
        strategy: 'priority',
        targets,
        fallbackTargets: [],
        enabled: true,
      });
      runtime.reloadRouteRules();
    }
  }

  // 3. 默认 API Key（演示用：sk-demo-xxx）
  const keyPage = runtime.repos.apiKey.list({}, { page: 1, pageSize: 1 });
  if (keyPage.total === 0) {
    const { plain, keyPrefix } = KeyGenerator.generate('demo');
    const { salt, hash } = KeyHasher.hash(plain);
    runtime.repos.apiKey.create({
      name: 'demo',
      tenant: 'demo',
      keyHash: KeyHasher.combine(salt, hash),
      salt,
      keyPrefix,
      modelWhitelist: [],
      qpsLimit: 100,
      concurrencyLimit: 20,
    });
    runtime.keyHashIndex.set(plain, KeyHasher.combine(salt, hash));
    runtime.logger.info({ plainKey: plain }, '已创建演示 API Key（请保存）');
  }
}
