import { uuid, shortId, generateRequestId, generateCorrelationId, snowflakeId } from '../../src/utils';

describe('id utils', () => {
  it('uuid 格式', () => {
    const id = uuid();
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('shortId 长度', () => {
    expect(shortId(8)).toHaveLength(8);
    expect(shortId(16)).toHaveLength(16);
  });

  it('请求 ID 前缀', () => {
    expect(generateRequestId()).toMatch(/^uag-/);
    expect(generateCorrelationId()).toMatch(/^cid-/);
  });

  it('雪花 ID 唯一', () => {
    const a = snowflakeId();
    const b = snowflakeId();
    expect(a).not.toBe(b);
  });
});
