import { maskKey } from '../src/utils/mask';
import { parseAuthHeader } from '../src/utils/request-parser';
import { buildPassthroughHeaders } from '../src/utils/headers';

describe('gateway utils', () => {
  it('maskKey', () => {
    expect(maskKey('sk-live-12345678')).toContain('***');
    expect(maskKey('')).toBe('');
    expect(maskKey('short')).toBe('***');
  });

  it('parseAuthHeader', () => {
    expect(parseAuthHeader('Bearer sk-1')).toBe('sk-1');
    expect(parseAuthHeader('Basic abc')).toBeNull();
    expect(parseAuthHeader(undefined)).toBeNull();
  });

  it('buildPassthroughHeaders 过滤受限头', () => {
    const headers = buildPassthroughHeaders({
      authorization: 'Bearer x',
      host: 'localhost',
      'x-custom': '1',
    });
    expect(headers.authorization).toBeUndefined();
    expect(headers.host).toBeUndefined();
    expect(headers['x-custom']).toBe('1');
  });
});
