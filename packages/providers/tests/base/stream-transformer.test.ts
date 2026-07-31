import { StreamTransformer } from '../../src/base/stream-transformer';

describe('StreamTransformer', () => {
  const transformer = new StreamTransformer();

  it('转换上游 chunk', () => {
    const chunk = transformer.transform(
      { id: 'c1', model: 'm', choices: [{ index: 0, delta: { content: 'hi' }, finish_reason: null }] },
      { id: 'fallback', model: 'fb' },
    );
    expect(chunk.object).toBe('chat.completion.chunk');
    expect(chunk.choices[0].delta.content).toBe('hi');
  });

  it('serialize 与 doneFrame', () => {
    const frame = transformer.serialize({
      id: 'c', object: 'chat.completion.chunk', created: 1, model: 'm',
      choices: [{ index: 0, delta: {}, finish_reason: null }],
    });
    expect(frame).toContain('data: ');
    expect(transformer.doneFrame()).toBe('data: [DONE]\n\n');
  });

  it('fallback id/model', () => {
    const chunk = transformer.transform({ choices: [] }, { id: 'fb-id', model: 'fb-model' });
    expect(chunk.id).toBe('fb-id');
    expect(chunk.model).toBe('fb-model');
  });
});
