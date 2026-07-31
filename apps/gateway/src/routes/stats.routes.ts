import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';
import { formatApiResponse } from '../utils/response-formatter';

/** /admin/stats 聚合 */
export function registerStatsRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.get('/admin/stats', { preHandler }, async (request) => {
    const query = request.query as {
      dimension?: string; model?: string; provider?: string; tenant?: string;
      startTime?: string; endTime?: string;
    };
    const dimension = (query.dimension ?? 'model') as 'model' | 'key' | 'provider' | 'date';
    const filter = {
      model: query.model,
      provider: query.provider,
      tenant: query.tenant,
      startTime: query.startTime,
      endTime: query.endTime,
    };
    const data = runtime.statsService.aggregate(dimension, filter);
    const hourly = runtime.statsService.hourly(filter);
    return formatApiResponse({ dimension, data, hourly });
  });
}
