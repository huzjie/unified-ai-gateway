import { LineChart as RechartsLine, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartTooltip } from './ChartTooltip';

export interface LineChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  series: Array<{ key: string; name: string; color?: string }>;
}

export function LineChart({ data, xKey, series }: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsLine data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey={xKey} stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" fontSize={12} />
        <Tooltip content={<ChartTooltip />} />
        {series.map((s) => (
          <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color ?? '#1976d2'} />
        ))}
      </RechartsLine>
    </ResponsiveContainer>
  );
}
