import type { GatewayEventType } from '@uag/types';
import type { WebhookEntity } from '../webhook-repository';

export interface IWebhookRepository {
  create(input: { name: string; url: string; secret: string; events: GatewayEventType[]; enabled?: boolean }): WebhookEntity;
  findById(id: string): WebhookEntity | null;
  listEnabled(): WebhookEntity[];
  delete(id: string): void;
}
