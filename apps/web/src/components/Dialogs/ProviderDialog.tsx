import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { providersApi } from '../../api-client/providers-api';
import { useToast } from '../../hooks/use-toast';
import type { ProviderType } from '../../types';

export interface ProviderDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const TYPES: ProviderType[] = ['openai', 'moonshot', 'deepseek', 'minimax', 'anthropic', 'ollama', 'mock'];

export function ProviderDialog({ open, onClose, onSaved }: ProviderDialogProps) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState<ProviderType>('openai');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [models, setModels] = useState('');

  const submit = async () => {
    try {
      await providersApi.create({
        name,
        type,
        baseUrl,
        apiKey: apiKey || undefined,
        models: models ? models.split(',').map((s) => s.trim()) : [],
      });
      toast.success('Provider 已添加');
      onSaved();
      onClose();
    } catch {
      toast.error('添加失败');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>添加 Provider</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <TextField label="名称" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <FormControl fullWidth>
          <InputLabel>类型</InputLabel>
          <Select value={type} label="类型" onChange={(e) => setType(e.target.value as ProviderType)}>
            {TYPES.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField label="Base URL" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} fullWidth />
        <TextField label="API Key（可选）" value={apiKey} onChange={(e) => setApiKey(e.target.value)} fullWidth type="password" />
        <TextField label="模型列表（逗号分隔）" value={models} onChange={(e) => setModels(e.target.value)} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button variant="contained" onClick={() => void submit()} disabled={!name || !baseUrl}>
          添加
        </Button>
      </DialogActions>
    </Dialog>
  );
}
