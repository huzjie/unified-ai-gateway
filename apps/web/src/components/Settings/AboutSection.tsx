import { Box, Typography, Link } from '@mui/material';

export function AboutSection() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        关于
      </Typography>
      <Typography variant="body2">版本: 1.0.0</Typography>
      <Typography variant="body2">许可证: Apache-2.0</Typography>
      <Link href="/healthz" target="_blank">健康检查 /healthz</Link>
    </Box>
  );
}
