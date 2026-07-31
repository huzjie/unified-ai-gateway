import { Box, Typography } from '@mui/material';
import { StatusBadge } from '../Common/StatusBadge';

export function ProviderHealth({ status }: { status: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" color="text.secondary">
        健康状态
      </Typography>
      <StatusBadge status={status} />
    </Box>
  );
}
