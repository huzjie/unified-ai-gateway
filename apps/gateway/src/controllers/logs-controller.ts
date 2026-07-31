import type { RuntimeRegistry } from '../services/runtime-registry';

export class LogsController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  query(query: Record<string, unknown>) {
    return this.runtime.logService.query(
      {
        keyId: query.keyId as string | undefined,
        tenant: query.tenant as string | undefined,
        model: query.model as string | undefined,
        provider: query.provider as string | undefined,
        statusCode: query.statusCode ? Number(query.statusCode) : undefined,
        search: query.search as string | undefined,
        startTime: query.startTime as string | undefined,
        endTime: query.endTime as string | undefined,
      },
      { page: Number(query.page ?? 1), pageSize: Number(query.pageSize ?? 20) },
    );
  }

  get(id: string) {
    return this.runtime.logService.get(id);
  }
}
