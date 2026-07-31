import type { RuntimeRegistry } from '../services/runtime-registry';

export class AuditController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  query(query: Record<string, unknown>) {
    return this.runtime.auditService.query(
      {
        actorId: query.actorId as string | undefined,
        action: query.action as string | undefined,
        resourceType: query.resourceType as string | undefined,
        result: query.result as never,
        startTime: query.startTime as string | undefined,
        endTime: query.endTime as string | undefined,
      },
      { page: Number(query.page ?? 1), pageSize: Number(query.pageSize ?? 20) },
    );
  }
}
