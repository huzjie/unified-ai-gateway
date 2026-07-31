import { AreaChart as RechartsArea, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartTooltip } from './ChartTooltip';

export interface AreaChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  areaKey: string;
  color?: string;
}

export function AreaChart({ data, xKey, areaKey, color = '#1976d2' }: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsArea data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey={xKey} stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" fontSize={12} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey={areaKey} stroke={color} fill={color} fillOpacity={0.2} />
      </RechartsArea>
    </ResponsiveContainer>
  );
}
