import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { keysApi } from '../../api-client/keys-api';
import { useToast } from '../../hooks/use-toast';
import { KeyCreateResult } from '../Keys/KeyCreateResult';

export interface KeyDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function KeyDialog({ open, onClose, onCreated }: KeyDialogProps) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [tenant, setTenant] = useState('');
  const [qps, setQps] = useState('100');
  const [plainKey, setPlainKey] = useState<string | null>(null);

  const submit = async () => {
    try {
      const result = await keysApi.create({
        name,
        tenant,
        qpsLimit: Number(qps),
      });
      setPlainKey(result.plainKey);
      toast.success('Key 创建成功');
      onCreated();
    } catch {
      toast.error('创建失败');
    }
  };

  const close = () => {
    setPlainKey(null);
    setName('');
    setTenant('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle>新建 API Key</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        {plainKey ? (
          <KeyCreateResult plainKey={plainKey} onDone={close} />
        ) : (
          <>
            <TextField label="名称" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
            <TextField label="租户/团队" value={tenant} onChange={(e) => setTenant(e.target.value)} fullWidth />
            <TextField label="QPS 上限" value={qps} onChange={(e) => setQps(e.target.value)} fullWidth type="number" />
          </>
        )}
      </DialogContent>
      {!plainKey && (
        <DialogActions>
          <Button onClick={close}>取消</Button>
          <Button variant="contained" onClick={() => void submit()} disabled={!name || !tenant}>
            创建
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
