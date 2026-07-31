import type { NewRouteRule, Page, PageResult, RouteRuleEntity, RouteRulePatch } from '@uag/types';
import type { SQLiteConnection } from '../connection/sqlite-connection';
import { BaseRepository } from './base-repository';
import type { IRouteRuleRepository } from './interfaces/route-rule-repository.interface';
import { Serializer } from '../services/serializer';
import { Paginator } from '../services/paginator';
import { IdGenerator } from '../services/id-generator';

interface RouteRuleRow {
  id: string;
  name: string;
  priority: number;
  match_model: string | null;
  match_tenant: string | null;
  strategy: string;
  targets_json: string;
  fallback_targets_json: string;
  breaker_threshold: number;
  enabled: number;
  created_at: string;
  updated_at: string;
}

function toEntity(row: RouteRuleRow): RouteRuleEntity {
  return {
    id: row.id,
    name: row.name,
    priority: row.priority,
    matchModel: row.match_model,
    matchTenant: row.match_tenant,
    strategy: row.strategy as RouteRuleEntity['strategy'],
    targets: Serializer.stringArray(row.targets_json),
    fallbackTargets: Serializer.stringArray(row.fallback_targets_json),
    breakerThreshold: row.breaker_threshold,
    enabled: row.enabled === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class RouteRuleRepository extends BaseRepository implements IRouteRuleRepository {
  protected readonly table = 'route_rules';

  constructor(conn: SQLiteConnection) {
    super(conn);
  }

  create(input: NewRouteRule): RouteRuleEntity {
    const now = new Date().toISOString();
    const id = IdGenerator.routeRule();
    this.insertRow(this.table, {
      id,
      name: input.name,
      priority: input.priority ?? 100,
      match_model: input.matchModel ?? null,
      match_tenant: input.matchTenant ?? null,
      strategy: input.strategy ?? 'priority',
      targets_json: Serializer.serialize(input.targets ?? []),
      fallback_targets_json: Serializer.serialize(input.fallbackTargets ?? []),
      breaker_threshold: input.breakerThreshold ?? 0.5,
      enabled: (input.enabled ?? true) ? 1 : 0,
      created_at: now,
      updated_at: now,
    });
    return this.findById(id)!;
  }

  findById(id: string): RouteRuleEntity | null {
    const row = this.findOne<RouteRuleRow>('id = ?', [id]);
    return row ? toEntity(row) : null;
  }

  findByName(name: string): RouteRuleEntity | null {
    const row = this.findOne<RouteRuleRow>('name = ?', [name]);
    return row ? toEntity(row) : null;
  }

  listEnabled(): RouteRuleEntity[] {
    const rows = this.conn
      .prepare('SELECT * FROM route_rules WHERE enabled = 1 ORDER BY priority ASC, created_at ASC')
      .all() as RouteRuleRow[];
    return rows.map(toEntity);
  }

  list(filter: { enabled?: boolean; search?: string }, page: Page): PageResult<RouteRuleEntity> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (filter.enabled !== undefined) {
      conditions.push('enabled = ?');
      params.push(filter.enabled ? 1 : 0);
    }
    if (filter.search) {
      conditions.push('(name LIKE ? OR match_model LIKE ?)');
      const kw = `%${filter.search}%`;
      params.push(kw, kw);
    }
    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const total = this.count(where, params);
    const p = Paginator.normalize(page.page, page.pageSize);
    const offset = (p.page - 1) * p.pageSize;
    const rows = this.conn
      .prepare(`SELECT * FROM route_rules ${where} ORDER BY priority ASC LIMIT ? OFFSET ?`)
      .all(...params, p.pageSize, offset) as RouteRuleRow[];
    return Paginator.wrap(rows.map(toEntity), total, p);
  }

  update(id: string, patch: RouteRulePatch): RouteRuleEntity {
    const data: Record<string, unknown> = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.priority !== undefined) data.priority = patch.priority;
    if (patch.matchModel !== undefined) data.match_model = patch.matchModel;
    if (patch.matchTenant !== undefined) data.match_tenant = patch.matchTenant;
    if (patch.strategy !== undefined) data.strategy = patch.strategy;
    if (patch.targets !== undefined) data.targets_json = Serializer.serialize(patch.targets);
    if (patch.fallbackTargets !== undefined) data.fallback_targets_json = Serializer.serialize(patch.fallbackTargets);
    if (patch.breakerThreshold !== undefined) data.breaker_threshold = patch.breakerThreshold;
    if (patch.enabled !== undefined) data.enabled = patch.enabled ? 1 : 0;
    this.updateRow(this.table, id, data);
    return this.findById(id)!;
  }

  delete(id: string): void {
    this.deleteRow(this.table, id);
  }
}
