import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Typography, Box } from '@mui/material';
import type { UsageLog } from '../../types';

export interface LogListProps {
  logs: UsageLog[];
  onRowClick: (log: UsageLog) => void;
}

function formatTime(iso: string): string {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString();
}

export function LogList({ logs, onRowClick }: LogListProps) {
  if (logs.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          暂无日志
        </Typography>
      </Paper>
    );
  }
  return (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ minWidth: 720 }}>
        <TableHead>
          <TableRow>
            <TableCell>时间</TableCell>
            <TableCell>模型</TableCell>
            <TableCell>Provider</TableCell>
            <TableCell>状态</TableCell>
            <TableCell align="right">耗时</TableCell>
            <TableCell align="right">Tokens</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => onRowClick(log)}
            >
              <TableCell>{formatTime(log.createdAt)}</TableCell>
              <TableCell>{log.model}</TableCell>
              <TableCell>{log.provider}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={log.statusCode < 400 ? 'success' : 'error'}
                  label={log.statusCode}
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">{log.latencyMs}ms</TableCell>
              <TableCell align="right">{log.totalTokens}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
