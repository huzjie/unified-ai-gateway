import { StorageFactory } from '../src/factory/storage-factory';

describe('WebhookRepository', () => {
  let factory: StorageFactory;

  beforeEach(() => {
    factory = new StorageFactory({ type: 'memory', databasePath: ':memory:' });
  });

  afterEach(() => factory.close());

  it('创建与查询', () => {
    const repo = factory.repos.webhook;
    const webhook = repo.create({
      name: 'alert',
      url: 'https://example.com/hook',
      secret: 's3cret',
      events: ['rate_limited', 'circuit_opened'],
    });
    expect(webhook.events).toContain('rate_limited');
    expect(repo.findById(webhook.id)?.url).toBe('https://example.com/hook');
  });

  it('listEnabled 过滤', () => {
    const repo = factory.repos.webhook;
    repo.create({ name: 'a', url: 'http://a', secret: 's', events: [], enabled: true });
    repo.create({ name: 'b', url: 'http://b', secret: 's', events: [], enabled: false });
    expect(repo.listEnabled().length).toBe(1);
  });

  it('删除', () => {
    const repo = factory.repos.webhook;
    const w = repo.create({ name: 'c', url: 'http://c', secret: 's', events: [] });
    repo.delete(w.id);
    expect(repo.findById(w.id)).toBeNull();
  });
});
