import { makeTestRuntime } from '../helpers/test-fixtures';

describe('RouteAdminService', () => {
  it('CRUD 与干跑', async () => {
    const runtime = await makeTestRuntime();
    const rule = runtime.routeAdminService.create({
      name: 'test-route',
      matchModel: 'my-main',
      priority: 10,
      strategy: 'priority',
      targets: ['mock'],
    });
    expect(rule.name).toBe('test-route');
    expect(runtime.routeAdminService.get(rule.id).strategy).toBe('priority');

    const dry = runtime.routeAdminService.dryRun('my-main', 'test');
    expect(dry.matched?.name).toBe('test-route');

    runtime.routeAdminService.remove(rule.id);
    expect(() => runtime.routeAdminService.get(rule.id)).toThrow();
    await runtime.shutdown();
  });
});
