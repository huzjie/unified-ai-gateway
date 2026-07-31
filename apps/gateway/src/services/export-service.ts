import type { RuntimeRegistry } from './runtime-registry';
import { csvExport } from '@uag/storage';
import type { UsageLog } from '@uag/types';

/**
 * CSV/JSON 导出
 */
export class ExportService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 导出用量报表 CSV */
  exportCsv(filter: { startTime?: string; endTime?: string; model?: string }): string {
    const logs: UsageLog[] = this.runtime.repos.usageLog.queryRange(filter);
    return csvExport({
      columns: [
        { header: '时间', key: 'createdAt' },
        { header: 'Key', key: 'keyId' },
        { header: '租户', key: 'tenant' },
        { header: '模型', key: 'model' },
        { header: 'Provider', key: 'provider' },
        { header: '状态码', key: 'statusCode' },
        { header: '耗时ms', key: 'latencyMs' },
        { header: '输入Tokens', key: 'promptTokens' },
        { header: '输出Tokens', key: 'completionTokens' },
        { header: '总Tokens', key: 'totalTokens' },
        { header: '成本(微元)', key: 'costAmount' },
      ],
      rows: logs.map((l) => ({
        createdAt: l.createdAt,
        keyId: l.keyId ?? '',
        tenant: l.tenant,
        model: l.model,
        provider: l.provider,
        statusCode: l.statusCode,
        latencyMs: l.latencyMs,
        promptTokens: l.promptTokens,
        completionTokens: l.completionTokens,
        totalTokens: l.totalTokens,
        costAmount: l.costAmount,
      })),
    });
  }
}
