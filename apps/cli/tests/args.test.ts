import { parseCommonArgs } from '../src/utils/args';

describe('args utils', () => {
  it('解析 --json', () => {
    expect(parseCommonArgs(['--json']).json).toBe(true);
    expect(parseCommonArgs([]).json).toBe(false);
  });

  it('解析 --api-url', () => {
    const args = parseCommonArgs(['--api-url', 'http://x:9999']);
    expect(args.apiUrl).toBe('http://x:9999');
    expect(parseCommonArgs([]).apiUrl).toBe('http://localhost:8787');
  });

  it('解析 --token', () => {
    expect(parseCommonArgs(['--token', 'abc']).token).toBe('abc');
    expect(parseCommonArgs([]).token).toBeUndefined();
  });
});
