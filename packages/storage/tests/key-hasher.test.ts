import { KeyHasher } from '../src/services/key-hasher';

describe('KeyHasher', () => {
  it('生成与校验', () => {
    const { salt, hash } = KeyHasher.hash('sk-live-abc');
    expect(salt).toHaveLength(32);
    expect(hash).toHaveLength(64);
    const stored = KeyHasher.combine(salt, hash);
    expect(KeyHasher.verify('sk-live-abc', stored)).toBe(true);
    expect(KeyHasher.verify('wrong', stored)).toBe(false);
  });

  it('非法格式返回 false', () => {
    expect(KeyHasher.verify('x', 'bad')).toBe(false);
  });

  it('同一明文不同 salt 哈希不同', () => {
    const a = KeyHasher.hash('key');
    const b = KeyHasher.hash('key');
    expect(a.hash).not.toBe(b.hash);
  });
});
