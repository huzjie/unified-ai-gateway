import { Box } from '@mui/material';
import { useState } from 'react';
import { PageHeader } from '../components/Common/PageHeader';
import { LogList } from '../components/Logs/LogList';
import { LogFilters } from '../components/Logs/LogFilters';
import { LogDetailDrawer } from '../components/Dialogs/LogDetailDrawer';
import { Pagination } from '../components/Common/Pagination';
import { Loading } from '../components/Common/Loading';
import { useLogs } from '../hooks/use-logs';
import { usePagination } from '../hooks/use-pagination';
import { useDebounce } from '../hooks/use-debounce';
import { useInterval } from '../hooks/use-interval';
import type { UsageLog } from '../types';

export default function LogsPage() {
  const { page, pageSize, changePage, params } = usePagination();
  const [search, setSearch] = useState('');
  const [model, setModel] = useState('');
  const [status, setStatus] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [detail, setDetail] = useState<UsageLog | null>(null);

  const filter = {
    search: debouncedSearch || undefined,
    model: model || undefined,
    statusCode: status ? Number(status) : undefined,
    page: params.page,
    pageSize: params.pageSize,
  };
  const { logs, total, loading, fetch } = useLogs(filter);

  useInterval(() => void fetch(filter), 30_000);

  return (
    <Box>
      <PageHeader title="请求日志" description="按时间 / Key / 模型 / 状态筛选，点击行查看详情" />
      <LogFilters
        search={search}
        onSearchChange={setSearch}
        model={model}
        onModelChange={setModel}
        status={status}
        onStatusChange={setStatus}
        onRefresh={() => void fetch(filter)}
      />
      {loading ? <Loading /> : <LogList logs={logs} onRowClick={setDetail} />}
      <Pagination page={page} pageSize={pageSize} total={total} onChange={changePage} />
      <LogDetailDrawer log={detail} open={Boolean(detail)} onClose={() => setDetail(null)} />
    </Box>
  );
}
