import { exponentialBackoff, fullJitter, computeBackoff } from '../../src/utils';

describe('backoff', () => {
  it('指数退避', () => {
    expect(exponentialBackoff(200, 5000, 0)).toBe(200);
    expect(exponentialBackoff(200, 5000, 1)).toBe(400);
    expect(exponentialBackoff(200, 5000, 2)).toBe(800);
  });

  it('封顶', () => {
    expect(exponentialBackoff(200, 5000, 10)).toBe(5000);
  });

  it('full jitter 在范围内', () => {
    for (let i = 0; i < 100; i++) {
      const j = fullJitter(1000);
      expect(j).toBeGreaterThanOrEqual(0);
      expect(j).toBeLessThan(1000);
    }
  });

  it('computeBackoff 返回正数', () => {
    const b = computeBackoff(200, 5000, 0);
    expect(b).toBeGreaterThan(0);
    expect(b).toBeLessThanOrEqual(200);
  });
});
