import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

/** 认证布局（登录页） */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420, p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Unified AI Gateway
        </Typography>
        {children}
      </Box>
    </Box>
  );
}
