import { makeTestRuntime } from '../helpers/test-fixtures';
import { createTestServer, closeTestServer } from '../helpers/test-server';
import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../../src/services/runtime-registry';

describe('AuthService', () => {
  it('正确凭证登录', async () => {
    const runtime: RuntimeRegistry = await makeTestRuntime();
    const server: FastifyInstance = await createTestServer(runtime);
    const result = await runtime.authService.login('admin', 'test-password-123');
    expect(result.token).toBeTruthy();
    expect(result.user.username).toBe('admin');
    await closeTestServer(server);
    await runtime.shutdown();
  });

  it('错误凭证拒绝', async () => {
    const runtime: RuntimeRegistry = await makeTestRuntime();
    const server: FastifyInstance = await createTestServer(runtime);
    await expect(runtime.authService.login('admin', 'wrong')).rejects.toThrow();
    await closeTestServer(server);
    await runtime.shutdown();
  });
});
