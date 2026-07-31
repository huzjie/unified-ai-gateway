import type { GatewayEventType } from '@uag/types';
import type { SQLiteConnection } from '../connection/sqlite-connection';
import { BaseRepository } from './base-repository';
import type { IWebhookRepository } from './interfaces/webhook-repository.interface';
import { Serializer } from '../services/serializer';
import { IdGenerator } from '../services/id-generator';

export interface WebhookEntity {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: GatewayEventType[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WebhookRow {
  id: string;
  name: string;
  url: string;
  secret: string;
  events_json: string;
  enabled: number;
  created_at: string;
  updated_at: string;
}

export class WebhookRepository extends BaseRepository implements IWebhookRepository {
  protected readonly table = 'webhooks';

  constructor(conn: SQLiteConnection) {
    super(conn);
  }

  create(input: { name: string; url: string; secret: string; events: GatewayEventType[]; enabled?: boolean }): WebhookEntity {
    const now = new Date().toISOString();
    const id = IdGenerator.uuid();
    this.insertRow(this.table, {
      id,
      name: input.name,
      url: input.url,
      secret: input.secret,
      events_json: Serializer.serialize(input.events),
      enabled: (input.enabled ?? true) ? 1 : 0,
      created_at: now,
      updated_at: now,
    });
    return this.findById(id)!;
  }

  findById(id: string): WebhookEntity | null {
    const row = this.findOne<WebhookRow>('id = ?', [id]);
    return row ? this.toEntity(row) : null;
  }

  listEnabled(): WebhookEntity[] {
    const rows = this.conn.prepare('SELECT * FROM webhooks WHERE enabled = 1').all() as WebhookRow[];
    return rows.map((r) => this.toEntity(r));
  }

  delete(id: string): void {
    this.deleteRow(this.table, id);
  }

  private toEntity(row: WebhookRow): WebhookEntity {
    return {
      id: row.id,
      name: row.name,
      url: row.url,
      secret: row.secret,
      events: Serializer.stringArray(row.events_json) as GatewayEventType[],
      enabled: row.enabled === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
