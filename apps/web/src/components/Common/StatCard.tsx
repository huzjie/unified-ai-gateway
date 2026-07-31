import { Card, CardContent, Typography, Box } from '@mui/material';

export interface StatCardProps {
  title: string;
  value: string | number;
  sub?: string;
  color?: string;
}

export function StatCard({ title, value, sub, color = '#1976d2' }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h4" sx={{ color, fontWeight: 700 }}>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" color="text.secondary">
              {sub}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
