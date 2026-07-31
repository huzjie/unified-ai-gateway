import { Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, TableContainer } from '@mui/material';
import { useEffect, useState } from 'react';
import { PageHeader } from '../components/Common/PageHeader';
import { Loading } from '../components/Common/Loading';
import { auditApi, type AuditLog } from '../api-client/audit-api';
import { StatusBadge } from '../components/Common/StatusBadge';

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void auditApi
      .query({ pageSize: 50 })
      .then((result) => setLogs(result.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <PageHeader title="审计日志" description="管理操作审计记录" />
      {loading ? (
        <Loading />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>时间</TableCell>
                <TableCell>操作</TableCell>
                <TableCell>资源</TableCell>
                <TableCell>结果</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.createdAt}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.resourceType}:{log.resourceId ?? '-'}</TableCell>
                  <TableCell><StatusBadge status={log.result} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
