import { Box, Typography } from '@mui/material';

export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) {
    return null;
  }
  return (
    <Box sx={{ bgcolor: '#0f172a', border: '1px solid #334155', borderRadius: 1, p: 1 }}>
      {label !== undefined && (
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      )}
      {payload.map((entry, i) => (
        <Typography key={i} variant="body2" sx={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </Typography>
      ))}
    </Box>
  );
}
