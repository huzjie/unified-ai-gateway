import { CryptoService } from '../src/services/crypto';

describe('CryptoService', () => {
  const service = new CryptoService('0123456789abcdef0123456789abcdef');

  it('加密解密往返', () => {
    const encrypted = service.encrypt('sk-secret-key-123');
    expect(encrypted).not.toContain('sk-secret');
    expect(service.decrypt(encrypted)).toBe('sk-secret-key-123');
  });

  it('密钥过短抛错', () => {
    expect(() => new CryptoService('short')).toThrow();
  });

  it('mask 掩码', () => {
    expect(CryptoService.mask('sk-abcdefghij')).toBe('sk-***hij');
    expect(CryptoService.mask('short')).toBe('***');
  });

  it('不同 IV 产生不同密文', () => {
    const a = service.encrypt('same');
    const b = service.encrypt('same');
    expect(a).not.toBe(b);
  });
});
