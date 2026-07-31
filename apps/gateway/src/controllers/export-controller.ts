import type { RuntimeRegistry } from '../services/runtime-registry';

export class ExportController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  csv(query: Record<string, unknown>) {
    return this.runtime.exportService.exportCsv({
      startTime: query.startTime as string | undefined,
      endTime: query.endTime as string | undefined,
      model: query.model as string | undefined,
    });
  }
}
