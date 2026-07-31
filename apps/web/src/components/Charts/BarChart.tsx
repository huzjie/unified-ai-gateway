import { BarChart as RechartsBar, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartTooltip } from './ChartTooltip';

export interface BarChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  barKey: string;
  color?: string;
}

export function BarChart({ data, xKey, barKey, color = '#1976d2' }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsBar data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey={xKey} stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" fontSize={12} />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey={barKey} fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  );
}
