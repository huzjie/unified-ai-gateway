import { Card, CardContent, Typography } from '@mui/material';
import { LineChart } from '../Charts/LineChart';
import type { DashboardData } from '../../types';

export function TrendChart({ data }: { data: DashboardData }) {
  const chartData = data.trend.map((t) => ({ hour: t.hour.slice(11, 16), requests: t.requests, errors: t.errors }));
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          调用量趋势
        </Typography>
        <LineChart
          data={chartData}
          xKey="hour"
          series={[
            { key: 'requests', name: '请求数', color: '#1976d2' },
            { key: 'errors', name: '错误数', color: '#ef4444' },
          ]}
        />
      </CardContent>
    </Card>
  );
}
