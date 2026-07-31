import { Box, Typography } from '@mui/material';

export interface RoutePreviewProps {
  decision: unknown;
}

export function RoutePreview({ decision }: RoutePreviewProps) {
  return (
    <Box sx={{ p: 2, bgcolor: '#0f172a', borderRadius: 1 }}>
      <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(decision, null, 2)}
      </Typography>
    </Box>
  );
}
