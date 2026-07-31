import { generateSseEventId } from '../src/utils/event-id';
import { toOpenAISseChunk, mergeStreams } from '../src/utils/stream-utils';

async function* single<T>(item: T): AsyncIterable<T> {
  yield item;
}

describe('provider utils', () => {
  it('event id', () => {
    expect(generateSseEventId()).toMatch(/^evt_/);
  });

  it('toOpenAISseChunk', () => {
    const chunk = toOpenAISseChunk({ id: 'i', model: 'm', delta: { content: 'x' } });
    expect(chunk.choices[0].delta.content).toBe('x');
  });

  it('mergeStreams', async () => {
    const items: string[] = [];
    for await (const item of mergeStreams([single('a'), single('b')])) {
      items.push((item as unknown as { v: string }).v);
    }
    expect(items).toHaveLength(2);
  });
});
