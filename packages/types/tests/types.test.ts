/**
 * 类型编译冒烟测试
 */
import {
  ErrorCode,
  normalizePage,
  toPageResult,
  ok,
  fail,
  microToYuan,
  yuanToMicro,
  formatMicroAmount,
} from '../src/index';

describe('@uag/types', () => {
  it('导出错误码枚举', () => {
    expect(ErrorCode.API_KEY_INVALID).toBe('UAG-2001');
    expect(ErrorCode.RATE_LIMITED).toBe('UAG-3001');
    expect(ErrorCode.CIRCUIT_OPEN).toBe('UAG-4003');
  });

  it('ok/fail 构造统一响应', () => {
    expect(ok({ a: 1 })).toEqual({ code: 0, data: { a: 1 }, message: 'ok' });
    expect(fail('UAG-5003', 'not found').code).toBe('UAG-5003');
  });

  it('分页工具归一化', () => {
    expect(normalizePage()).toEqual({ page: 1, pageSize: 20 });
    expect(normalizePage(0, 1000)).toEqual({ page: 1, pageSize: 100 });
    const result = toPageResult([1, 2], 45, { page: 3, pageSize: 20 });
    expect(result.totalPages).toBe(3);
  });

  it('金额微元换算', () => {
    expect(yuanToMicro(1)).toBe(1_000_000);
    expect(microToYuan(1_000_000)).toBe(1);
    expect(formatMicroAmount(326400)).toBe('0.3264');
  });
});
