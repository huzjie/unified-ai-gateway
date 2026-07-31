import { makeTestRuntime } from '../helpers/test-fixtures';

describe('KeyService', () => {
  it('创建 Key 返回明文一次', async () => {
    const runtime = await makeTestRuntime();
    const result = runtime.keyService.createKey({ name: 'svc', tenant: 'svc' });
    expect(result.plainKey).toMatch(/^sk-live-/);
    expect(result.key.keyHash).not.toContain('sk-live');
    expect(runtime.repos.apiKey.findByHash(result.key.keyHash)).not.toBeNull();
    await runtime.shutdown();
  });

  it('吊销 Key', async () => {
    const runtime = await makeTestRuntime();
    const { key } = runtime.keyService.createKey({ name: 'a', tenant: 't' });
    runtime.keyService.revoke(key.id);
    expect(runtime.repos.apiKey.findById(key.id)?.status).toBe('revoked');
    await runtime.shutdown();
  });
});
