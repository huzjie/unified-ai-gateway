import { Box, Button } from '@mui/material';
import { PageHeader } from '../components/Common/PageHeader';
import { DataSettings } from '../components/Settings/DataSettings';
import { useToast } from '../hooks/use-toast';

export default function ExportPage() {
  const toast = useToast();
  return (
    <Box>
      <PageHeader title="导出" description="用量报表导出（CSV）" />
      <Button variant="contained" onClick={() => toast.info('请在系统设置-数据管理导出 CSV')}>
        导出用量报表
      </Button>
      <Box sx={{ mt: 3 }}>
        <DataSettings />
      </Box>
    </Box>
  );
}
