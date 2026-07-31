import type { RuntimeRegistry } from '../services/runtime-registry';

export class ProvidersController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  list(query: Record<string, unknown>) {
    return this.runtime.providerAdminService.list(
      {
        type: query.type as string | undefined,
        search: query.search as string | undefined,
      },
      { page: Number(query.page ?? 1), pageSize: Number(query.pageSize ?? 20) },
    );
  }

  async create(body: Record<string, unknown>) {
    return this.runtime.providerAdminService.create({
      name: String(body.name),
      type: body.type as never,
      baseUrl: String(body.baseUrl),
      apiKey: body.apiKey as string | undefined,
      models: (body.models as string[]) ?? [],
      pricing: (body.pricing as Record<string, unknown>) ?? {},
      timeoutMs: Number(body.timeoutMs ?? 30000),
      maxRetries: Number(body.maxRetries ?? 2),
      enabled: (body.enabled as never) ?? 'enabled',
    });
  }

  async update(id: string, body: Record<string, unknown>) {
    return this.runtime.providerAdminService.update(id, body as never);
  }

  remove(id: string) {
    return this.runtime.providerAdminService.remove(id);
  }

  test(id: string) {
    return this.runtime.providerAdminService.test(id);
  }
}
