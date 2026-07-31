import { sha256Hex, hashWithSalt, verifyHash, generateSalt } from '../../src/utils';

describe('hash', () => {
  it('sha256Hex 输出 64 位 hex', () => {
    expect(sha256Hex('hello')).toHaveLength(64);
    expect(sha256Hex('hello')).toBe(sha256Hex('hello'));
  });

  it('hashWithSalt 格式 salt:hash', () => {
    const { salt, hash } = hashWithSalt('secret');
    expect(salt).toHaveLength(32);
    expect(hash).toHaveLength(64);
  });

  it('verifyHash 校验通过/失败', () => {
    const stored = hashWithSalt('my-key');
    const combined = `${stored.salt}:${stored.hash}`;
    expect(verifyHash('my-key', combined)).toBe(true);
    expect(verifyHash('wrong', combined)).toBe(false);
  });

  it('verifyHash 非法格式返回 false', () => {
    expect(verifyHash('x', 'no-colon')).toBe(false);
  });

  it('generateSalt 唯一', () => {
    expect(generateSalt()).not.toBe(generateSalt());
  });
});
