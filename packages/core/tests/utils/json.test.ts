import { safeJsonParse, safeJsonStringify, isJsonObject, deepJsonParse } from '../../src/utils';

describe('json utils', () => {
  it('safeJsonParse 成功/失败', () => {
    expect(safeJsonParse('{"a":1}', {})).toEqual({ a: 1 });
    expect(safeJsonParse('bad', { fallback: true })).toEqual({ fallback: true });
  });

  it('safeJsonStringify', () => {
    expect(safeJsonStringify({ a: 1 })).toBe('{"a":1}');
    expect(safeJsonStringify(undefined)).toBe('');
  });

  it('isJsonObject', () => {
    expect(isJsonObject({})).toBe(true);
    expect(isJsonObject([])).toBe(false);
    expect(isJsonObject(null)).toBe(false);
  });

  it('deepJsonParse 嵌套解析', () => {
    const result = deepJsonParse('{"a":"{\\"b\\":1}"}') as Record<string, unknown>;
    expect((result.a as Record<string, unknown>).b).toBe(1);
  });
});
