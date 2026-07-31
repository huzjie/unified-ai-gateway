import { resolveLimitScope } from '../src/rate-limiter/context-resolver';
import { resolveBreakerKey } from '../src/circuit-breaker/context-resolver';

describe('rate-limiter context-resolver', () => {
  it('解析作用域', () => {
    const scopes = resolveLimitScope({
      apiKey: { id: 'k1', qpsLimit: 10, concurrencyLimit: 5 } as never,
      tenant: 't1',
      ip: '1.2.3.4',
    });
    expect(scopes.some((s) => s.kind === 'key' && s.id === 'k1')).toBe(true);
    expect(scopes.some((s) => s.kind === 'tenant')).toBe(true);
    expect(scopes.some((s) => s.kind === 'ip')).toBe(true);
  });

  it('无 Key 时只有 tenant/ip', () => {
    const scopes = resolveLimitScope({ tenant: 't', ip: '1.1.1.1' });
    expect(scopes.some((s) => s.kind === 'key')).toBe(false);
  });
});

describe('circuit-breaker context-resolver', () => {
  it('resolveBreakerKey', () => {
    expect(resolveBreakerKey('moonshot')).toBe('moonshot');
    expect(resolveBreakerKey('moonshot', 'kimi-k3')).toBe('moonshot:kimi-k3');
  });
});
