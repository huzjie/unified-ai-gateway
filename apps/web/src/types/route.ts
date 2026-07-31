export type RouteStrategy = 'priority' | 'failover' | 'cost-first' | 'random';

export interface RouteRule {
  id: string;
  name: string;
  priority: number;
  matchModel: string | null;
  matchTenant: string | null;
  strategy: RouteStrategy;
  targets: string[];
  fallbackTargets: string[];
  breakerThreshold: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RouteRuleCreateInput {
  name: string;
  priority?: number;
  matchModel?: string | null;
  matchTenant?: string | null;
  strategy?: RouteStrategy;
  targets: string[];
  fallbackTargets?: string[];
  breakerThreshold?: number;
  enabled?: boolean;
}
