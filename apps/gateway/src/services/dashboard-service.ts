import type { DashboardData, UsageLog } from '@uag/types';
import type { RuntimeRegistry } from './runtime-registry';

/**
 * 仪表盘聚合
 */
export class DashboardService {
  constructor(private readonly runtime: RuntimeRegistry) {}

  /** 聚合仪表盘数据（近 N 天） */
  get(days = 7): DashboardData {
    const end = new Date().toISOString();
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const filter = { startTime: start, endTime: end };

    const logs: UsageLog[] = this.runtime.repos.usageLog.queryRange(filter);
    const total = logs.length;
    const success = logs.filter((l) => l.statusCode >= 200 && l.statusCode < 400).length;
    const rateLimited = logs.filter((l) => l.statusCode === 429).length;
    const totalCost = logs.reduce((sum, l) => sum + l.costAmount, 0);
    const avgLatency = total > 0 ? logs.reduce((sum, l) => sum + l.latencyMs, 0) / total : 0;
    const sortedLatency = logs.map((l) => l.latencyMs).sort((a, b) => a - b);
    const p95 = sortedLatency.length > 0 ? sortedLatency[Math.floor((sortedLatency.length - 1) * 0.95)] : 0;

    // 趋势（按小时）
    const trendMap = new Map<string, { requests: number; errors: number }>();
    for (const log of logs) {
      const hour = log.createdAt.slice(0, 13) + ':00';
      const current = trendMap.get(hour) ?? { requests: 0, errors: 0 };
      current.requests += 1;
      if (log.statusCode >= 400) current.errors += 1;
      trendMap.set(hour, current);
    }

    // 模型占比
    const modelMap = new Map<string, number>();
    for (const log of logs) {
      modelMap.set(log.model, (modelMap.get(log.model) ?? 0) + 1);
    }

    // 成本 Top Key
    const keyMap = new Map<string, { keyId: string; keyPrefix: string; tenant: string; requests: number; cost: number }>();
    for (const log of logs) {
      const kid = log.keyId ?? 'anonymous';
      const current = keyMap.get(kid) ?? { keyId: kid, keyPrefix: kid, tenant: log.tenant, requests: 0, cost: 0 };
      current.requests += 1;
      current.cost += log.costAmount;
      keyMap.set(kid, current);
    }

    // 每日明细
    const dailyMap = new Map<string, { requests: number; cost: number; successRate: number; success: number }>();
    for (const log of logs) {
      const date = log.createdAt.slice(0, 10);
      const current = dailyMap.get(date) ?? { requests: 0, cost: 0, successRate: 0, success: 0 };
      current.requests += 1;
      current.cost += log.costAmount;
      if (log.statusCode >= 200 && log.statusCode < 400) current.success += 1;
      dailyMap.set(date, current);
    }

    const data: DashboardData = {
      range: { start, end },
      metrics: {
        totalRequests: total,
        todayRequests: logs.filter((l) => l.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length,
        todayCost: totalCost,
        successRate: total > 0 ? Number(((success / total) * 100).toFixed(2)) : 100,
        avgLatencyMs: Number(avgLatency.toFixed(1)),
        p95LatencyMs: Number(p95.toFixed(1)),
        circuitOpenCount: this.runtime.breaker.snapshots().filter((s) => s.state === 'OPEN').length,
        rateLimitedCount: rateLimited,
      },
      trend: [...trendMap.entries()]
        .map(([hour, v]) => ({ hour, ...v }))
        .sort((a, b) => a.hour.localeCompare(b.hour)),
      modelShare: [...modelMap.entries()]
        .map(([model, requests]) => ({ model, requests, percent: total > 0 ? Number(((requests / total) * 100).toFixed(1)) : 0 }))
        .sort((a, b) => b.requests - a.requests),
      costTopKeys: [...keyMap.values()].sort((a, b) => b.cost - a.cost).slice(0, 10),
      daily: [...dailyMap.entries()]
        .map(([date, v]) => ({ date, requests: v.requests, cost: v.cost, successRate: v.requests > 0 ? Number(((v.success / v.requests) * 100).toFixed(1)) : 100 }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    };
    return data;
  }
}
