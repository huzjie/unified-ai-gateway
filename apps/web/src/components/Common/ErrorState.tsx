import { Alert, Box } from '@mui/material';

export function ErrorState({ message = '加载失败' }: { message?: string }) {
  return (
    <Box sx={{ py: 2 }}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}
