import type { RuntimeRegistry } from '../services/runtime-registry';

export class StatsController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  aggregate(query: Record<string, unknown>) {
    const dimension = (query.dimension ?? 'model') as 'model' | 'key' | 'provider' | 'date';
    const filter = {
      model: query.model as string | undefined,
      provider: query.provider as string | undefined,
      tenant: query.tenant as string | undefined,
      startTime: query.startTime as string | undefined,
      endTime: query.endTime as string | undefined,
    };
    return {
      dimension,
      data: this.runtime.statsService.aggregate(dimension, filter),
      hourly: this.runtime.statsService.hourly(filter),
    };
  }
}
