import { PieChart as RechartsPie, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartTooltip } from './ChartTooltip';

const COLORS = ['#1976d2', '#7c4dff', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

export interface PieChartProps {
  data: Array<{ name: string; value: number }>;
}

export function PieChart({ data }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsPie>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend />
      </RechartsPie>
    </ResponsiveContainer>
  );
}
