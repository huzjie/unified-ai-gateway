import { RequestContextBuilder } from '../../src/context';

describe('RequestContextBuilder', () => {
  it('构建上下文（含 Key 信息）', () => {
    const builder = new RequestContextBuilder();
    const ctx = builder.build({
      apiKey: {
        id: 'key-1', name: 'test', tenant: 'data', keyHash: 'h', keyPrefix: 'sk-test',
        status: 'active', modelWhitelist: [], qpsLimit: 10, concurrencyLimit: 5,
        monthlyQuotaTokens: 0, monthlyQuotaAmount: 0, expiresAt: null,
        createdAt: new Date().toISOString(), lastUsedAt: null, revokedAt: null,
      },
      ip: '1.2.3.4',
      virtualModel: 'my-main',
      payload: { model: 'my-main', messages: [{ role: 'user', content: 'hi' }] },
    });
    expect(ctx.tenant).toBe('data');
    expect(ctx.virtualModel).toBe('my-main');
    expect(ctx.requestId).toBeTruthy();
    expect(ctx.startedAt).toBeGreaterThan(0);
  });

  it('buildFromHttp 提取 model', () => {
    const builder = new RequestContextBuilder();
    const ctx = builder.buildFromHttp({
      body: { model: 'gpt-4o', messages: [] },
      ip: '127.0.0.1',
    });
    expect(ctx.virtualModel).toBe('gpt-4o');
    expect(ctx.tenant).toBe('anonymous');
    expect(ctx.stream).toBe(false);
  });

  it('流式标记', () => {
    const builder = new RequestContextBuilder();
    const ctx = builder.buildFromHttp({ body: { model: 'm', messages: [], stream: true } });
    expect(ctx.stream).toBe(true);
  });
});
