import { maskKey } from '../src/utils/mask';

describe('mask utils', () => {
  it('掩码 Key', () => {
    expect(maskKey('sk-live-12345678')).toContain('***');
    expect(maskKey('')).toBe('');
    expect(maskKey('short')).toBe('***');
  });
});
