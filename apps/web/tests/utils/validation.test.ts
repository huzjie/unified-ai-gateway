import { isValidUrl, isPositiveNumber } from '../src/utils/validation';

describe('validation utils', () => {
  it('URL 校验', () => {
    expect(isValidUrl('https://api.openai.com')).toBe(true);
    expect(isValidUrl('not-a-url')).toBe(false);
  });

  it('正数校验', () => {
    expect(isPositiveNumber(10)).toBe(true);
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(-1)).toBe(false);
  });
});
