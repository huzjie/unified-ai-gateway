import { StorageFactory } from '../src/factory/storage-factory';
import type { AuditLog } from '@uag/types';

function makeAudit(overrides: Partial<AuditLog> = {}): AuditLog {
  return {
    id: `audit-${Math.random()}`,
    actorType: 'admin',
    actorId: 'admin-1',
    action: 'key.create',
    resourceType: 'api_key',
    resourceId: 'key-1',
    detailJson: null,
    ip: '127.0.0.1',
    userAgent: 'jest',
    result: 'success',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('AuditLogRepository', () => {
  let factory: StorageFactory;

  beforeEach(() => {
    factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
  });

  afterEach(() => factory.close());

  it('插入与查询', () => {
    const repo = factory.repos.auditLog;
    const log = makeAudit();
    repo.insert(log);
    expect(repo.findById(log.id)?.action).toBe('key.create');
  });

  it('query 过滤', () => {
    const repo = factory.repos.auditLog;
    repo.insert(makeAudit({ action: 'key.create', result: 'success' }));
    repo.insert(makeAudit({ action: 'provider.update', result: 'failure' }));
    const create = repo.query({ action: 'key.create' }, { page: 1, pageSize: 10 });
    expect(create.total).toBe(1);
    const failed = repo.query({ result: 'failure' }, { page: 1, pageSize: 10 });
    expect(failed.total).toBe(1);
  });

  it('deleteOlderThan', () => {
    const repo = factory.repos.auditLog;
    repo.insert(makeAudit({ createdAt: '2020-01-01T00:00:00.000Z' }));
    repo.insert(makeAudit());
    expect(repo.deleteOlderThan('2021-01-01T00:00:00.000Z')).toBe(1);
  });
});
