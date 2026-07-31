import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { PageHeader } from '../components/Common/PageHeader';
import { KeyList } from '../components/Keys/KeyList';
import { KeyDialog } from '../components/Dialogs/KeyDialog';
import { Pagination } from '../components/Common/Pagination';
import { Loading } from '../components/Common/Loading';
import { useKeys } from '../hooks/use-keys';
import { usePagination } from '../hooks/use-pagination';
import { useToast } from '../hooks/use-toast';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';

export default function KeysPage() {
  const { page, pageSize, changePage, params } = usePagination();
  const { keys, total, loading, fetch, revoke } = useKeys(params);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const toast = useToast();

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    await revoke(revokeTarget);
    toast.success('Key 已吊销');
    setRevokeTarget(null);
    void fetch(params);
  };

  return (
    <Box>
      <PageHeader
        title="API Keys"
        description="多租户 Key 管理：每个 Key 独立限流与模型白名单"
        actions={
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setDialogOpen(true)}>
            新建 Key
          </Button>
        }
      />
      {loading ? <Loading /> : <KeyList keys={keys} onRevoke={(id) => setRevokeTarget(id)} />}
      <Pagination page={page} pageSize={pageSize} total={total} onChange={changePage} />
      <KeyDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onCreated={() => void fetch(params)} />
      <ConfirmDialog
        open={Boolean(revokeTarget)}
        title="吊销 Key"
        message="吊销后该 Key 立即失效，确定继续？"
        onConfirm={() => void handleRevoke()}
        onCancel={() => setRevokeTarget(null)}
      />
    </Box>
  );
}
