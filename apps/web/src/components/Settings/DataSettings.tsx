import { Box, Button, Typography } from '@mui/material';
import { exportApi } from '../../api-client/export-api';
import { useToast } from '../../hooks/use-toast';

export function DataSettings() {
  const toast = useToast();
  const download = async () => {
    try {
      const csv = await exportApi.csv();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usage-report.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('导出成功');
    } catch {
      toast.error('导出失败');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        数据管理
      </Typography>
      <Button variant="outlined" onClick={() => void download()}>
        导出用量报表（CSV）
      </Button>
    </Box>
  );
}
