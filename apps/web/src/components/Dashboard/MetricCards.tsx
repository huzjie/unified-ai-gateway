import { Box } from '@mui/material';
import { StatCard } from '../Common/StatCard';
import type { DashboardData } from '../../types';

export function MetricCards({ data }: { data: DashboardData }) {
  const m = data.metrics;
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
      <StatCard title="今日调用量" value={m.todayRequests.toLocaleString()} sub={`共 ${m.totalRequests.toLocaleString()}`} color="#1976d2" />
      <StatCard title="今日成本" value={`¥${(m.todayCost / 1_000_000).toFixed(2)}`} sub="CNY" color="#22c55e" />
      <StatCard title="成功率" value={`${m.successRate}%`} sub={`限流 ${m.rateLimitedCount}`} color="#7c4dff" />
      <StatCard title="平均延迟" value={`${m.avgLatencyMs}ms`} sub={`P95 ${m.p95LatencyMs}ms · 熔断 ${m.circuitOpenCount}`} color="#f59e0b" />
    </Box>
  );
}
