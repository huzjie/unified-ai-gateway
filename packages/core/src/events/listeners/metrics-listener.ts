import type { GatewayEvent } from '@uag/types';
import type { EventHandler } from '../event-types';

/** 指标快照 */
export interface MetricsSnapshot {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  rateLimitedCount: number;
  circuitOpenCount: number;
  circuitOpenedTotal: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  currentQps: number;
  uptimeMs: number;
  providerFailures: Record<string, number>;
  modelRequests: Record<string, number>;
}

/**
 * 指标计数监听（内存维护计数，供仪表盘/导出）
 */
export class MetricsListener {
  readonly handler: EventHandler;

  private totalRequests = 0;
  private successCount = 0;
  private errorCount = 0;
  private rateLimitedCount = 0;
  private circuitOpenCount = 0;
  private circuitOpenedTotal = 0;
  private latencies: number[] = [];
  private providerFailures: Record<string, number> = {};
  private modelRequests: Record<string, number> = {};
  private readonly startedAt = Date.now();
  private recentTimestamps: number[] = [];

  constructor() {
    this.handler = (event: GatewayEvent) => {
      switch (event.type) {
        case 'request_started':
          this.totalRequests += 1;
          this.recentTimestamps.push(Date.now());
          const model = (event.payload as { model?: string }).model;
          if (model) {
            this.modelRequests[model] = (this.modelRequests[model] ?? 0) + 1;
          }
          break;
        case 'request_completed': {
          const p = event.payload as { success?: boolean; latencyMs?: number };
          if (p.success) {
            this.successCount += 1;
          } else {
            this.errorCount += 1;
          }
          if (p.latencyMs !== undefined) {
            this.latencies.push(p.latencyMs);
            if (this.latencies.length > 10_000) {
              this.latencies = this.latencies.slice(-5_000);
            }
          }
          break;
        }
        case 'rate_limited':
          this.rateLimitedCount += 1;
          break;
        case 'circuit_opened':
          this.circuitOpenCount += 1;
          this.circuitOpenedTotal += 1;
          break;
        case 'circuit_closed':
          this.circuitOpenCount = Math.max(0, this.circuitOpenCount - 1);
          break;
        case 'provider_failed': {
          const p = event.payload as { providerKey?: string };
          if (p.providerKey) {
            this.providerFailures[p.providerKey] = (this.providerFailures[p.providerKey] ?? 0) + 1;
          }
          break;
        }
        default:
          break;
      }
    };
  }

  /** 快照 */
  snapshot(): MetricsSnapshot {
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const p95 = sorted.length === 0 ? 0 : sorted[Math.floor((sorted.length - 1) * 0.95)];
    const avg = this.latencies.length === 0 ? 0 : this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length;
    const now = Date.now();
    this.recentTimestamps = this.recentTimestamps.filter((t) => now - t < 1000);
    return {
      totalRequests: this.totalRequests,
      successCount: this.successCount,
      errorCount: this.errorCount,
      rateLimitedCount: this.rateLimitedCount,
      circuitOpenCount: this.circuitOpenCount,
      circuitOpenedTotal: this.circuitOpenedTotal,
      avgLatencyMs: Number(avg.toFixed(1)),
      p95LatencyMs: Number(p95.toFixed(1)),
      currentQps: this.recentTimestamps.length,
      uptimeMs: now - this.startedAt,
      providerFailures: { ...this.providerFailures },
      modelRequests: { ...this.modelRequests },
    };
  }

  /** 重置（测试用） */
  reset(): void {
    this.totalRequests = 0;
    this.successCount = 0;
    this.errorCount = 0;
    this.rateLimitedCount = 0;
    this.circuitOpenCount = 0;
    this.circuitOpenedTotal = 0;
    this.latencies = [];
    this.providerFailures = {};
    this.modelRequests = {};
    this.recentTimestamps = [];
  }
}
