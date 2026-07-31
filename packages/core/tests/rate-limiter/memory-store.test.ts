import { MemoryStore } from '../../src/rate-limiter';

describe('MemoryStore', () => {
  it('自增', () => {
    const store = new MemoryStore();
    expect(store.incr('a')).toBe(1);
    expect(store.incr('a')).toBe(2);
    expect(store.incr('b', 5)).toBe(5);
  });

  it('set/get/delete', () => {
    const store = new MemoryStore();
    store.set('k', { x: 1 });
    expect(store.get('k')).toEqual({ x: 1 });
    expect(store.delete('k')).toBe(true);
    expect(store.get('k')).toBeUndefined();
  });

  it('deletePrefix', () => {
    const store = new MemoryStore();
    store.set('p:1', 1);
    store.set('p:2', 2);
    store.set('q:1', 3);
    store.deletePrefix('p:');
    expect(store.size).toBe(1);
  });

  it('TTL 清理', () => {
    jest.useFakeTimers();
    try {
      const store = new MemoryStore();
      store.set('expire', 1, 10);
      // TTL 未到期时立即可读
      expect(store.get('expire')).toBe(1);
      // 推进时间超过 TTL 后应被清理
      jest.advanceTimersByTime(11);
      store.prune();
      expect(store.get('expire')).toBeUndefined();
    } finally {
      jest.useRealTimers();
    }
  });

  it('clear', () => {
    const store = new MemoryStore();
    store.set('a', 1);
    store.clear();
    expect(store.size).toBe(0);
  });
});
