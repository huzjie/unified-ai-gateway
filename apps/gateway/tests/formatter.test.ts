import { formatApiResponse, formatErrorResponse } from '../src/utils/response-formatter';
import { parsePagination } from '../src/utils/pagination';
import { validateBody } from '../src/utils/validation';

describe('response formatter', () => {
  it('formatApiResponse', () => {
    expect(formatApiResponse({ a: 1 })).toEqual({ code: 0, data: { a: 1 }, message: 'ok' });
  });

  it('formatErrorResponse', () => {
    const err = formatErrorResponse('UAG-5003', 'not found', { id: 1 });
    expect(err.code).toBe('UAG-5003');
    expect(err.details).toEqual({ id: 1 });
  });
});

describe('pagination', () => {
  it('parsePagination', () => {
    expect(parsePagination({})).toEqual({ page: 1, pageSize: 20 });
    expect(parsePagination({ page: '2', pageSize: '50' })).toEqual({ page: 2, pageSize: 50 });
  });
});

describe('validation', () => {
  it('validateBody', () => {
    expect(() => validateBody({ a: 1 }, ['a'])).not.toThrow();
    expect(() => validateBody({}, ['a'])).toThrow();
    expect(() => validateBody(null, ['a'])).toThrow();
  });
});
