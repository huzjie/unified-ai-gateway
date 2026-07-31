import { Card, CardContent, Typography } from '@mui/material';
import { PieChart } from '../Charts/PieChart';
import type { DashboardData } from '../../types';

export function ModelShareChart({ data }: { data: DashboardData }) {
  const chartData = data.modelShare.map((m) => ({ name: m.model, value: m.requests }));
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          各模型调用占比
        </Typography>
        <PieChart data={chartData} />
      </CardContent>
    </Card>
  );
}
