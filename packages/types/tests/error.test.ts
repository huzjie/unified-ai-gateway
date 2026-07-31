/**
 * 错误枚举完整性测试
 */
import { ErrorCode, ERROR_HTTP_STATUS, ERROR_RETRYABLE } from '../src/index';

describe('error code table', () => {
  it('错误码表完整（17 个错误码全部有 HTTP 映射）', () => {
    const codes = Object.values(ErrorCode);
    expect(codes.length).toBe(17);
    for (const code of codes) {
      expect(ERROR_HTTP_STATUS[code]).toBeDefined();
      expect(typeof ERROR_RETRYABLE[code]).toBe('boolean');
    }
  });

  it('关键错误码 HTTP 映射正确', () => {
    expect(ERROR_HTTP_STATUS[ErrorCode.API_KEY_INVALID]).toBe(401);
    expect(ERROR_HTTP_STATUS[ErrorCode.API_KEY_REVOKED]).toBe(403);
    expect(ERROR_HTTP_STATUS[ErrorCode.RATE_LIMITED]).toBe(429);
    expect(ERROR_HTTP_STATUS[ErrorCode.ALL_PROVIDERS_FAILED]).toBe(502);
    expect(ERROR_HTTP_STATUS[ErrorCode.CIRCUIT_OPEN]).toBe(503);
    expect(ERROR_HTTP_STATUS[ErrorCode.UPSTREAM_TIMEOUT]).toBe(504);
    expect(ERROR_HTTP_STATUS[ErrorCode.VALIDATION_FAILED]).toBe(400);
    expect(ERROR_HTTP_STATUS[ErrorCode.NOT_FOUND]).toBe(404);
  });

  it('可重试标记正确', () => {
    expect(ERROR_RETRYABLE[ErrorCode.RATE_LIMITED]).toBe(true);
    expect(ERROR_RETRYABLE[ErrorCode.PROVIDER_UNAVAILABLE]).toBe(true);
    expect(ERROR_RETRYABLE[ErrorCode.API_KEY_INVALID]).toBe(false);
    expect(ERROR_RETRYABLE[ErrorCode.VALIDATION_FAILED]).toBe(false);
  });
});
