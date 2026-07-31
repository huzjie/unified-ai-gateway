import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { PageHeader } from '../components/Common/PageHeader';
import { ProviderList } from '../components/Providers/ProviderList';
import { ProviderDialog } from '../components/Dialogs/ProviderDialog';
import { Loading } from '../components/Common/Loading';
import { useProviders } from '../hooks/use-providers';
import { useToast } from '../hooks/use-toast';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';
import { providersApi } from '../api-client/providers-api';

export default function ProvidersPage() {
  const { providers, total, loading, fetch, remove } = useProviders({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const toast = useToast();

  const handleRemove = async () => {
    if (!removeTarget) return;
    await remove(removeTarget);
    toast.success('Provider 已删除');
    setRemoveTarget(null);
    void fetch({});
  };

  const handleTest = async (id: string) => {
    const result = await providersApi.test(id);
    if (result.ok) {
      toast.success(`连接正常（${result.latencyMs}ms）`);
    } else {
      toast.error(`连接失败: ${result.message}`);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Providers"
        description="配置各 LLM Provider：类型 / Base URL / API Key（加密存储）/ 模型"
        actions={
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setDialogOpen(true)}>
            添加 Provider
          </Button>
        }
      />
      {loading ? <Loading /> : <ProviderList providers={providers} onRemove={(id) => setRemoveTarget(id)} onTest={(id) => void handleTest(id)} />}
      <Box sx={{ mt: 1 }}>
        共 {total} 个 Provider
      </Box>
      <ProviderDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSaved={() => void fetch({})} />
      <ConfirmDialog
        open={Boolean(removeTarget)}
        title="删除 Provider"
        message="删除后该 Provider 立即不可用，确定继续？"
        onConfirm={() => void handleRemove()}
        onCancel={() => setRemoveTarget(null)}
      />
    </Box>
  );
}
