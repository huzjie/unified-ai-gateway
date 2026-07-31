import { Drawer, Box, Typography, Divider } from '@mui/material';
import type { UsageLog } from '../../types';

export interface LogDetailDrawerProps {
  log: UsageLog | null;
  open: boolean;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}

export function LogDetailDrawer({ log, open, onClose }: LogDetailDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 420 } }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          请求详情
        </Typography>
        {log ? (
          <>
            <Row label="Request ID" value={log.requestId} />
            <Row label="时间" value={log.createdAt} />
            <Row label="Key" value={log.keyId ?? '-'} />
            <Row label="租户" value={log.tenant} />
            <Row label="模型" value={log.model} />
            <Row label="Provider" value={log.provider} />
            <Row label="状态码" value={String(log.statusCode)} />
            <Row label="耗时" value={`${log.latencyMs}ms`} />
            <Row label="Tokens" value={`${log.promptTokens} / ${log.completionTokens}`} />
            <Row label="成本" value={`${(log.costAmount / 1_000_000).toFixed(6)} 元`} />
            <Row label="流式" value={log.stream ? '是' : '否'} />
            <Row label="缓存命中" value={log.cacheHit ? '是' : '否'} />
            <Divider sx={{ my: 2 }} />
            {log.errorMessage && (
              <Typography variant="body2" color="error">
                错误: {log.errorMessage}
              </Typography>
            )}
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">
            无详情
          </Typography>
        )}
      </Box>
    </Drawer>
  );
}
