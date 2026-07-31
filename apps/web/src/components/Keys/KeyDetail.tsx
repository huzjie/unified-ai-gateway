import { Box, Typography, Chip } from '@mui/material';
import type { ApiKey } from '../../types';

export function KeyDetail({ key: k }: { key: ApiKey }) {
  return (
    <Box>
      <Typography variant="h6">{k.name}</Typography>
      <Typography variant="body2" color="text.secondary">
        {k.id}
      </Typography>
      <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip size="small" label={k.status} />
        <Chip size="small" label={`QPS ${k.qpsLimit}`} />
        <Chip size="small" label={`并发 ${k.concurrencyLimit}`} />
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        模型白名单: {k.modelWhitelist.length > 0 ? k.modelWhitelist.join(', ') : '*'}
      </Typography>
    </Box>
  );
}
