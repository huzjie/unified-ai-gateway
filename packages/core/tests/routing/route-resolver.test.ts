import { RouteResolver } from '../../src/routing';
import type { RequestContext, RouteRuleEntity } from '@uag/types';

function makeContext(virtualModel: string, tenant = 't1'): RequestContext {
  return {
    requestId: 'r1',
    apiKey: null,
    tenant,
    ip: '127.0.0.1',
    virtualModel,
    payload: { model: virtualModel, messages: [] },
    routeDecision: null,
    usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    cost: null,
    stream: false,
    headers: {},
    startedAt: Date.now(),
  } as RequestContext;
}

describe('RouteResolver', () => {
  const rules: RouteRuleEntity[] = [
    {
      id: 'r1', name: 'data-team', priority: 1, matchModel: null, matchTenant: 'data',
      strategy: 'cost-first', targets: ['deepseek'], fallbackTargets: [], breakerThreshold: 0.5,
      enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      id: 'r2', name: 'main-chat', priority: 2, matchModel: 'my-main', matchTenant: null,
      strategy: 'priority', targets: ['moonshot', 'openai'], fallbackTargets: ['ollama'], breakerThreshold: 0.5,
      enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
    {
      id: 'r3', name: 'disabled', priority: 0, matchModel: 'x', matchTenant: null,
      strategy: 'priority', targets: ['mock'], fallbackTargets: [], breakerThreshold: 0.5,
      enabled: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    },
  ];

  const source = {
    listEnabledRules: () => rules,
    resolveModel: (provider: string, _virtual: string) => `${provider}-model`,
    getProviderInputPrice: (provider: string) => (provider === 'deepseek' ? 1 : 10),
    getProviderOutputPrice: () => undefined,
    getProviderWeight: () => 1,
    isProviderHealthy: () => true,
    listAllProviders: () => ['deepseek', 'moonshot', 'openai'],
  };

  const resolver = new RouteResolver(source);

  it('按租户匹配规则', () => {
    const { rule } = resolver.resolve(makeContext('anything', 'data'));
    expect(rule?.id).toBe('r1');
  });

  it('按模型匹配规则', () => {
    const { rule, candidates } = resolver.resolve(makeContext('my-main', 'dev'));
    expect(rule?.id).toBe('r2');
    expect(candidates.map((c) => c.provider)).toEqual(['moonshot', 'openai', 'ollama']);
    expect(candidates[0].model).toBe('moonshot-model');
  });

  it('未匹配时返回 null rule', () => {
    const { rule } = resolver.resolve(makeContext('unknown', 'dev'));
    expect(rule).toBeNull();
  });
});
