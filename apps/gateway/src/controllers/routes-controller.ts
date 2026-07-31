import type { RuntimeRegistry } from '../services/runtime-registry';

export class RoutesController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  list(query: Record<string, unknown>) {
    return this.runtime.routeAdminService.list(
      { search: query.search as string | undefined },
      { page: Number(query.page ?? 1), pageSize: Number(query.pageSize ?? 20) },
    );
  }

  create(body: Record<string, unknown>) {
    return this.runtime.routeAdminService.create({
      name: String(body.name),
      priority: Number(body.priority ?? 100),
      matchModel: (body.matchModel as string) ?? null,
      matchTenant: (body.matchTenant as string) ?? null,
      strategy: (body.strategy as never) ?? 'priority',
      targets: (body.targets as string[]) ?? [],
      fallbackTargets: (body.fallbackTargets as string[]) ?? [],
      breakerThreshold: Number(body.breakerThreshold ?? 0.5),
      enabled: body.enabled !== false,
    });
  }

  update(id: string, body: Record<string, unknown>) {
    return this.runtime.routeAdminService.update(id, body as never);
  }

  remove(id: string) {
    return this.runtime.routeAdminService.remove(id);
  }

  dryRun(model: string, tenant: string) {
    return this.runtime.routeAdminService.dryRun(model, tenant);
  }
}
