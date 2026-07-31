import { RouterEngine } from '../../src/routing';
import { RouteResolver } from '../../src/routing';
import { StrategyFactory } from '../../src/routing';
import type { RouteRuleEntity } from '@uag/types';
import type { RequestContext } from '@uag/types';

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

describe('RouterEngine', () => {
  const rule: RouteRuleEntity = {
    id: 'rule-1',
    name: 'main',
    priority: 1,
    matchModel: 'my-main',
    matchTenant: null,
    strategy: 'priority',
    targets: ['moonshot', 'deepseek'],
    fallbackTargets: [],
    breakerThreshold: 0.5,
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const source = {
    listEnabledRules: () => [rule],
    resolveModel: (provider: string, _virtual: string) => (provider === 'moonshot' ? 'kimi-k3' : 'deepseek-v4'),
    getProviderInputPrice: () => undefined,
    getProviderOutputPrice: () => undefined,
    getProviderWeight: () => undefined,
    isProviderHealthy: () => true,
  };

  const engine = new RouterEngine(new RouteResolver(source), new StrategyFactory());

  it('解析命中规则并选择首个候选', () => {
    const decision = engine.resolve(makeContext('my-main'));
    expect(decision.provider).toBe('moonshot');
    expect(decision.model).toBe('kimi-k3');
    expect(decision.virtualModel).toBe('my-main');
    expect(decision.candidates).toEqual(['deepseek']);
    expect(decision.failoverChain).toEqual(['moonshot', 'deepseek']);
  });

  it('故障转移取下一个候选', () => {
    const first = engine.resolve(makeContext('my-main'));
    const next = engine.nextCandidate(first, 'upstream_error');
    expect(next).not.toBeNull();
    expect(next!.provider).toBe('deepseek');
    expect(next!.candidates).toEqual([]);
    expect(next!.failoverChain).toEqual(['moonshot', 'deepseek']);
  });

  it('无候选时返回 null', () => {
    const first = engine.resolve(makeContext('my-main'));
    const second = engine.nextCandidate(first, 'upstream_error');
    const third = engine.nextCandidate(second!, 'upstream_error');
    expect(third).toBeNull();
  });

  it('未命中规则时返回空决策', () => {
    const decision = engine.resolve(makeContext('unknown-model'));
    expect(decision.provider).toBe('');
    expect(decision.candidates).toEqual([]);
  });
});
