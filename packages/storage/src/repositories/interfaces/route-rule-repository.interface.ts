import type { NewRouteRule, Page, PageResult, RouteRuleEntity, RouteRulePatch } from '@uag/types';

export interface IRouteRuleRepository {
  create(input: NewRouteRule): RouteRuleEntity;
  findById(id: string): RouteRuleEntity | null;
  findByName(name: string): RouteRuleEntity | null;
  listEnabled(): RouteRuleEntity[];
  list(filter: { enabled?: boolean; search?: string }, page: Page): PageResult<RouteRuleEntity>;
  update(id: string, patch: RouteRulePatch): RouteRuleEntity;
  delete(id: string): void;
}
