import { RequestBuilder } from '../../src/base/request-builder';

describe('RequestBuilder', () => {
  const builder = new RequestBuilder();

  it('构建请求 URL/头/体', () => {
    const req = builder.build('https://api.x.com/v1/', '/chat/completions', 'sk-1', {
      model: 'm',
      messages: [{ role: 'user', content: 'hi' }],
      temperature: 0.5,
      maxTokens: 100,
    });
    expect(req.url).toBe('https://api.x.com/v1/chat/completions');
    expect(req.headers.authorization).toBe('Bearer sk-1');
    expect(req.body.model).toBe('m');
    expect(req.body.temperature).toBe(0.5);
  });

  it('无 Key 不设鉴权头', () => {
    const req = builder.build('https://api.x.com', '/chat/completions', null, { model: 'm', messages: [] });
    expect(req.headers.authorization).toBeUndefined();
  });

  it('透传 extraBody', () => {
    const req = builder.build('https://api.x.com', '/chat/completions', null, {
      model: 'm',
      messages: [],
      extraBody: { custom: 1 },
    });
    expect(req.body.custom).toBe(1);
  });
});
