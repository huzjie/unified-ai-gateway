import { KeyGenerator } from '../src/services/key-generator';

describe('KeyGenerator', () => {
  it('生成格式 sk-live-xxx', () => {
    const { plain, keyPrefix } = KeyGenerator.generate('live');
    expect(plain).toMatch(/^sk-live-[0-9a-f]{32}$/);
    expect(plain.startsWith(keyPrefix)).toBe(true);
  });

  it('每次生成不同', () => {
    const a = KeyGenerator.generate();
    const b = KeyGenerator.generate();
    expect(a.plain).not.toBe(b.plain);
  });

  it('extractPrefix', () => {
    expect(KeyGenerator.extractPrefix('sk-live-1234567890abcdef', 14)).toBe('sk-live-123456');
  });
});
