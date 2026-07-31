import { IdGenerator } from '../src/services/id-generator';

describe('IdGenerator', () => {
  it('生成 UUID', () => {
    expect(IdGenerator.uuid()).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('前缀 ID', () => {
    expect(IdGenerator.provider()).toMatch(/^prov_/);
    expect(IdGenerator.apiKey()).toMatch(/^key_/);
    expect(IdGenerator.routeRule()).toMatch(/^rule_/);
    expect(IdGenerator.log()).toMatch(/^log_/);
    expect(IdGenerator.audit()).toMatch(/^audit_/);
    expect(IdGenerator.cache()).toMatch(/^cache_/);
  });

  it('唯一性', () => {
    expect(IdGenerator.provider()).not.toBe(IdGenerator.provider());
  });
});
