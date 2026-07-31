import { Alert, Box, Typography, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useToast } from '../../hooks/use-toast';

/** 明文仅展示一次 */
export function KeyCreateResult({ plainKey, onDone }: { plainKey: string; onDone: () => void }) {
  const toast = useToast();
  const copy = async () => {
    await navigator.clipboard.writeText(plainKey);
    toast.success('已复制');
  };
  return (
    <Box>
      <Alert severity="warning">⚠️ 明文 Key 仅此一次显示，请立即保存！</Alert>
      <Box sx={{ mt: 2, p: 2, bgcolor: '#0f172a', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{plainKey}</Typography>
        <Button startIcon={<ContentCopyIcon />} onClick={() => void copy()}>复制</Button>
      </Box>
      <Button sx={{ mt: 2 }} variant="contained" onClick={onDone}>
        我已保存，关闭
      </Button>
    </Box>
  );
}
