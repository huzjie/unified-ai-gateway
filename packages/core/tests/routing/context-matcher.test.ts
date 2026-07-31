import { ContextMatcher } from '../../src/routing';
import type { RequestContext, RouteRuleEntity } from '@uag/types';

function makeRule(overrides: Partial<RouteRuleEntity> = {}): RouteRuleEntity {
  return {
    id: 'r', name: 'r', priority: 1, matchModel: null, matchTenant: null,
    strategy: 'priority', targets: ['a'], fallbackTargets: [], breakerThreshold: 0.5,
    enabled: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeCtx(model: string, tenant: string): RequestContext {
  return {
    requestId: 'x', apiKey: null, tenant, ip: '1.1.1.1', virtualModel: model,
    payload: { model, messages: [] }, routeDecision: null,
    usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }, cost: null,
    stream: false, headers: {}, startedAt: Date.now(),
  };
}

describe('ContextMatcher', () => {
  const matcher = new ContextMatcher();

  it('无匹配条件匹配所有', () => {
    expect(matcher.match(makeRule(), makeCtx('m', 't'))).toBe(true);
  });

  it('模型精确匹配', () => {
    expect(matcher.match(makeRule({ matchModel: 'my-main' }), makeCtx('my-main', 't'))).toBe(true);
    expect(matcher.match(makeRule({ matchModel: 'my-main' }), makeCtx('other', 't'))).toBe(false);
  });

  it('租户匹配', () => {
    expect(matcher.match(makeRule({ matchTenant: 'data' }), makeCtx('m', 'data'))).toBe(true);
    expect(matcher.match(makeRule({ matchTenant: 'data' }), makeCtx('m', 'dev'))).toBe(false);
  });

  it('通配符', () => {
    expect(matcher.match(makeRule({ matchModel: 'deepseek*' }), makeCtx('deepseek-chat', 't'))).toBe(true);
    expect(matcher.match(makeRule({ matchModel: '*flash' }), makeCtx('deepseek-v4-flash', 't'))).toBe(true);
    expect(matcher.match(makeRule({ matchModel: '*' }), makeCtx('anything', 't'))).toBe(true);
  });

  it('禁用规则不匹配', () => {
    expect(matcher.match(makeRule({ enabled: false }), makeCtx('m', 't'))).toBe(false);
  });
});
