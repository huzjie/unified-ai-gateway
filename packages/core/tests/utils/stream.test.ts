import { asyncIterableToArray, collectStream } from '../../src/utils';

async function* gen(items: number[]): AsyncIterable<number> {
  for (const item of items) {
    yield item;
  }
}

async function* genStr(items: string[]): AsyncIterable<string> {
  for (const item of items) {
    yield item;
  }
}

describe('stream utils', () => {
  it('asyncIterableToArray 收集', async () => {
    const arr = await asyncIterableToArray(gen([1, 2, 3]));
    expect(arr).toEqual([1, 2, 3]);
  });

  it('collectStream 拼接', async () => {
    const out = await collectStream(genStr(['a', 'b', 'c']));
    expect(out).toBe('abc');
  });

  it('空流', async () => {
    expect(await asyncIterableToArray(gen([]))).toEqual([]);
    expect(await collectStream(genStr([]))).toBe('');
  });
});
