import { HeadersBuilder } from '../../src/base/headers-builder';
import { AuthBuilder } from '../../src/base/auth-builder';

describe('HeadersBuilder', () => {
  it('json/acceptSse', () => {
    expect(HeadersBuilder.json()['content-type']).toBe('application/json');
    expect(HeadersBuilder.acceptSse().accept).toBe('text/event-stream');
  });

  it('merge 与 withExtra', () => {
    const merged = HeadersBuilder.merge({ a: '1' }, { b: '2' });
    expect(merged).toEqual({ a: '1', b: '2' });
    expect(HeadersBuilder.withExtra({ a: '1' }, { c: '3' }).c).toBe('3');
  });
});

describe('AuthBuilder', () => {
  it('bearer', () => {
    expect(AuthBuilder.bearer('sk-1')).toEqual({ authorization: 'Bearer sk-1' });
  });

  it('header / anthropic / none', () => {
    expect(AuthBuilder.header('X-API-Key', 'v')['x-api-key']).toBe('v');
    const anthro = AuthBuilder.anthropic('k');
    expect(anthro['x-api-key']).toBe('k');
    expect(anthro['anthropic-version']).toBe('2023-06-01');
    expect(AuthBuilder.none()).toEqual({});
  });
});
