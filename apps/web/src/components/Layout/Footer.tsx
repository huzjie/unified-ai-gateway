import { Typography, Box } from '@mui/material';

export function Footer() {
  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="caption" color="text.secondary">
        Unified AI Gateway v1.0.0 · Apache-2.0
      </Typography>
    </Box>
  );
}
