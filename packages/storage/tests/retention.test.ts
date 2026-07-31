import { StorageFactory } from '../src/factory/storage-factory';
import { RetentionUtils } from '../src/utils/retention-utils';
import type { UsageLog } from '@uag/types';

function makeLog(createdAt: string): UsageLog {
  return {
    id: `l-${Math.random()}`, requestId: 'r', keyId: 'k1', tenant: 't', model: 'm',
    provider: 'p', providerModel: 'm', statusCode: 200, latencyMs: 10,
    promptTokens: 1, completionTokens: 1, totalTokens: 2, costAmount: 0,
    currency: 'CNY', stream: false, cacheHit: false, errorCode: null, errorMessage: null,
    createdAt,
  };
}

describe('RetentionUtils', () => {
  it('清理过期日志', () => {
    const factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
    factory.repos.usageLog.insert(makeLog('2020-01-01T00:00:00.000Z'));
    factory.repos.usageLog.insert(makeLog(new Date().toISOString()));
    factory.repos.auditLog.insert({
      id: 'a1', actorType: 'admin', actorId: 'x', action: 'test', resourceType: 'k',
      resourceId: null, detailJson: null, ip: null, userAgent: null, result: 'success',
      createdAt: '2020-01-01T00:00:00.000Z',
    });
    const utils = new RetentionUtils(factory.db.connection);
    const result = utils.cleanup(30);
    expect(result.usageLogs).toBe(1);
    expect(result.auditLogs).toBe(1);
    factory.close();
  });
});
