import type { RuntimeRegistry } from '../services/runtime-registry';

export class KeysController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  list(query: Record<string, unknown>) {
    return this.runtime.keyService.list(
      {
        tenant: query.tenant as string | undefined,
        status: query.status as never,
        search: query.search as string | undefined,
      },
      { page: Number(query.page ?? 1), pageSize: Number(query.pageSize ?? 20) },
    );
  }

  create(body: Record<string, unknown>) {
    return this.runtime.keyService.createKey({
      name: String(body.name),
      tenant: String(body.tenant),
      modelWhitelist: (body.modelWhitelist as string[]) ?? [],
      qpsLimit: Number(body.qpsLimit ?? 100),
      concurrencyLimit: Number(body.concurrencyLimit ?? 20),
      monthlyQuotaTokens: Number(body.monthlyQuotaTokens ?? 0),
      monthlyQuotaAmount: Number(body.monthlyQuotaAmount ?? 0),
      expiresAt: (body.expiresAt as string) ?? null,
    });
  }

  revoke(id: string) {
    return this.runtime.keyService.revoke(id);
  }
}
