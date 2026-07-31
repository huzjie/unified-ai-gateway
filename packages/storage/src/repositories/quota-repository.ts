import type { SQLiteConnection } from '../connection/sqlite-connection';
import { BaseRepository } from './base-repository';
import type { IQuotaRepository } from './interfaces/quota-repository.interface';
import { DateUtils } from '../services/date-utils';

export interface QuotaUsageEntity {
  id: number;
  tenant: string;
  period: string;
  tokensUsed: number;
  amountUsed: number;
  updatedAt: string;
}

interface QuotaRow {
  id: number;
  tenant: string;
  period: string;
  tokens_used: number;
  amount_used: number;
  updated_at: string;
}

export class QuotaRepository extends BaseRepository implements IQuotaRepository {
  protected readonly table = 'quota_usage';

  constructor(conn: SQLiteConnection) {
    super(conn);
  }

  get(tenant: string, period = DateUtils.monthPeriod()): QuotaUsageEntity | null {
    const row = this.conn
      .prepare('SELECT * FROM quota_usage WHERE tenant = ? AND period = ?')
      .get(tenant, period) as QuotaRow | undefined;
    return row ? this.toEntity(row) : null;
  }

  addUsage(tenant: string, tokens: number, amount: number, period = DateUtils.monthPeriod()): QuotaUsageEntity {
    const now = new Date().toISOString();
    this.conn
      .prepare(`
        INSERT INTO quota_usage (tenant, period, tokens_used, amount_used, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(tenant, period) DO UPDATE SET
          tokens_used = quota_usage.tokens_used + excluded.tokens_used,
          amount_used = quota_usage.amount_used + excluded.amount_used,
          updated_at = excluded.updated_at
      `)
      .run(tenant, period, tokens, amount, now);
    return this.get(tenant, period)!;
  }

  reset(tenant: string, period: string): void {
    this.conn.prepare(`UPDATE quota_usage SET tokens_used = 0, amount_used = 0 WHERE tenant = ? AND period = ?`).run(tenant, period);
  }

  private toEntity(row: QuotaRow): QuotaUsageEntity {
    return {
      id: row.id,
      tenant: row.tenant,
      period: row.period,
      tokensUsed: row.tokens_used,
      amountUsed: row.amount_used,
      updatedAt: row.updated_at,
    };
  }
}
