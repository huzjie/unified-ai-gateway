import { ErrorMapper } from '../../src/base/error-mapper';
import { AppError } from '@uag/core';

describe('ErrorMapper', () => {
  const mapper = new ErrorMapper();

  it('5xx → 可重试', () => {
    const err = mapper.map(500, { error: { message: 'upstream down' } });
    expect(err.code).toBe('UAG-4001');
    expect(err.retryable).toBe(true);
  });

  it('429 → 限流', () => {
    const err = mapper.map(429, { error: { message: 'rate limited' } });
    expect(err.code).toBe('UAG-3001');
    expect(err.retryAfterMs).toBe(1000);
  });

  it('504 → 超时', () => {
    const err = mapper.map(504, {});
    expect(err.code).toBe('UAG-4004');
  });

  it('401 → 不可重试', () => {
    const err = mapper.map(401, { error: { message: 'unauthorized' } });
    expect(err.code).toBe('UAG-5001');
    expect(err.retryable).toBe(false);
  });

  it('网络错误映射', () => {
    const err = mapper.mapNetworkError(new Error('socket timeout'));
    expect(err.code).toBe('UAG-4004');
    const err2 = mapper.mapNetworkError(new Error('connection refused'));
    expect(err2.code).toBe('UAG-4001');
  });

  it('AppError 透传', () => {
    const original = new AppError('UAG-2001' as never, 'auth');
    const mapped = mapper.mapNetworkError(original);
    expect(mapped).toBe(original);
  });
});
