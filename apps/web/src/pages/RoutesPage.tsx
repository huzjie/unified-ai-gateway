import { Box, Button, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { PageHeader } from '../components/Common/PageHeader';
import { RouteList } from '../components/Routes/RouteList';
import { RouteDialog } from '../components/Dialogs/RouteDialog';
import { RoutePreview } from '../components/Routes/RoutePreview';
import { Loading } from '../components/Common/Loading';
import { useRoutes } from '../hooks/use-routes';
import { useToast } from '../hooks/use-toast';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';
import { routesApi } from '../api-client/routes-api';

export default function RoutesPage() {
  const { routes, total, loading, fetch, remove } = useRoutes({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [dryModel, setDryModel] = useState('my-main');
  const [dryResult, setDryResult] = useState<unknown>(null);
  const toast = useToast();

  const handleRemove = async () => {
    if (!removeTarget) return;
    await remove(removeTarget);
    toast.success('路由规则已删除');
    setRemoveTarget(null);
    void fetch({});
  };

  const handleDryRun = async () => {
    const result = await routesApi.dryRun(dryModel, 'default');
    setDryResult(result);
  };

  return (
    <Box>
      <PageHeader
        title="路由规则"
        description="智能路由：优先级 / 故障转移 / 成本优先 / 随机"
        actions={
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setDialogOpen(true)}>
            新建规则
          </Button>
        }
      />
      {loading ? <Loading /> : <RouteList routes={routes} onRemove={(id) => setRemoveTarget(id)} />}
      <Box sx={{ mt: 1 }}>共 {total} 条规则</Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField size="small" label="干跑模型" value={dryModel} onChange={(e) => setDryModel(e.target.value)} />
          <Button variant="outlined" onClick={() => void handleDryRun()}>干跑</Button>
        </Box>
        {Boolean(dryResult) && (
          <RoutePreview decision={dryResult} />
        )}
      </Box>
      <RouteDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSaved={() => void fetch({})} />
      <ConfirmDialog
        open={Boolean(removeTarget)}
        title="删除规则"
        message="删除后该规则立即失效，确定继续？"
        onConfirm={() => void handleRemove()}
        onCancel={() => setRemoveTarget(null)}
      />
    </Box>
  );
}
