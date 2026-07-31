import { BodyNormalizer } from '../../src/base/body-normalizer';

describe('BodyNormalizer', () => {
  const normalizer = new BodyNormalizer();

  it('填充默认值', () => {
    const params = normalizer.normalize({ model: 'm', messages: [] });
    expect(params.temperature).toBe(1);
    expect(params.topP).toBe(1);
    expect(params.maxTokens).toBe(4096);
  });

  it('保留显式值', () => {
    const params = normalizer.normalize({ model: 'm', messages: [], temperature: 0.2 });
    expect(params.temperature).toBe(0.2);
  });

  it('validate', () => {
    expect(() => normalizer.validate({ model: '', messages: [] })).toThrow('model');
    expect(() => normalizer.validate({ model: 'm', messages: [] })).toThrow('messages');
    expect(() => normalizer.validate({ model: 'm', messages: [{ role: 'user', content: 'x' }] })).not.toThrow();
  });
});
