import { deepMerge, pick, omit, maskSecret, maskApiKey, isPlainObject, deepClone } from '../../src/utils/object';

describe('object utils', () => {
  it('deepMerge', () => {
    const result = deepMerge({ a: 1, b: { x: 1 } }, { b: { y: 2 }, c: 3 });
    expect(result).toEqual({ a: 1, b: { x: 1, y: 2 }, c: 3 });
  });

  it('pick / omit', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
    expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('掩码', () => {
    expect(maskSecret('abcdefghij', 2, 2)).toContain('***');
    expect(maskApiKey('sk-live-9a1234567890')).toContain('***');
  });

  it('isPlainObject / deepClone', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(deepClone({ a: [1, 2] })).toEqual({ a: [1, 2] });
  });
});
