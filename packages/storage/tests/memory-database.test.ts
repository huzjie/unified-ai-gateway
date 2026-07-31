import { MemoryDatabase, MemoryCollections } from '../src/memory';

describe('MemoryDatabase', () => {
  it('集合 CRUD', () => {
    const db = new MemoryDatabase();
    const collection = db.collections.providers;
    collection.insert({ id: 'p1', name: 'a' } as never);
    expect(collection.find('p1')).toBeTruthy();
    expect(collection.count()).toBe(1);
    collection.delete('p1');
    expect(collection.count()).toBe(0);
  });

  it('filter 与 findWhere', () => {
    const col = MemoryCollections.createCollection<{ id: string; type: string }>([
      { id: '1', type: 'openai' },
      { id: '2', type: 'mock' },
    ]);
    expect(col.filter((x) => x.type === 'openai').length).toBe(1);
    expect(col.findWhere((x) => x.type === 'mock')?.id).toBe('2');
  });

  it('update 合并补丁', () => {
    const col = MemoryCollections.createCollection<{ id: string; name: string }>([{ id: '1', name: 'a' }]);
    const updated = col.update('1', { name: 'b' });
    expect(updated?.name).toBe('b');
    expect(col.find('1')?.name).toBe('b');
  });

  it('clear 清空', () => {
    const db = new MemoryDatabase();
    db.collections.providers.insert({ id: 'x' } as never);
    db.clear();
    expect(db.collections.providers.count()).toBe(0);
  });
});
