import type { RuntimeRegistry } from '../services/runtime-registry';

/** (P2) */
export class WebhookController {
  constructor(private readonly runtime: RuntimeRegistry) {}

  list() {
    return this.runtime.repos.webhook.listEnabled();
  }

  create(body: Record<string, unknown>) {
    return this.runtime.repos.webhook.create({
      name: String(body.name),
      url: String(body.url),
      secret: String(body.secret),
      events: (body.events as never) ?? [],
    });
  }
}
