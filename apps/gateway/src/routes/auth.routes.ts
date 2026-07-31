import type { FastifyInstance } from 'fastify';
import type { RuntimeRegistry } from '../services/runtime-registry';

/** POST /admin/auth/login */
export function registerAuthRoutes(server: FastifyInstance, runtime: RuntimeRegistry): void {
  server.post('/admin/auth/login', async (request, reply) => {
    const body = request.body as { username?: string; password?: string };
    if (!body?.username || !body?.password) {
      return reply.status(400).send({ code: 'UAG-5002', message: 'username 与 password 必填' });
    }
    const result = await runtime.authService.login(body.username, body.password);
    return reply.send({ code: 0, data: result, message: 'ok' });
  });
}
