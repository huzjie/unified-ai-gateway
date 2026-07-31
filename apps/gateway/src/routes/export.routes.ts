import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';
import { createAdminAuth } from '../middleware/admin-auth';

/** /admin/export/csv */
export function registerExportRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  const preHandler = [createAdminAuth(runtime)];

  server.get('/admin/export/csv', { preHandler }, async (request, reply) => {
    const query = request.query as { startTime?: string; endTime?: string; model?: string };
    const csv = runtime.exportService.exportCsv(query);
    reply.header('content-type', 'text/csv; charset=utf-8');
    reply.header('content-disposition', 'attachment; filename="usage-report.csv"');
    return csv;
  });
}
