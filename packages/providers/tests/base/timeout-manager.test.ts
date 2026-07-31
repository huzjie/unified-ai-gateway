import { TimeoutManager } from '../../src/base/timeout-manager';

describe('TimeoutManager', () => {
  const manager = new TimeoutManager(30000);

  it('resolve 默认与覆盖', () => {
    expect(manager.resolve()).toBe(30000);
    expect(manager.resolve(5000)).toBe(5000);
    expect(manager.resolve(0)).toBe(30000);
  });

  it('withTimeout 超时', async () => {
    await expect(
      manager.withTimeout(new Promise((r) => setTimeout(r, 100)), 10, 'slow'),
    ).rejects.toThrow('slow');
  });
});
