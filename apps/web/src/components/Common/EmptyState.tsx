import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

export function EmptyState({ message = '暂无数据' }: { message?: string }) {
  return (
    <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
      <InboxIcon sx={{ fontSize: 48, mb: 1 }} />
      <Typography variant="body1">{message}</Typography>
    </Box>
  );
}
