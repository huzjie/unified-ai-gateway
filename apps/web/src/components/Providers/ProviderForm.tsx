import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import type { ProviderType } from '../../types';

export interface ProviderFormProps {
  onSubmit: (input: { name: string; type: ProviderType; baseUrl: string; apiKey?: string }) => Promise<void>;
}

export function ProviderForm({ onSubmit }: ProviderFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ProviderType>('openai');
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');

  const submit = async () => {
    await onSubmit({ name, type, baseUrl, apiKey: apiKey || undefined });
    setName('');
    setBaseUrl('');
    setApiKey('');
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
      <TextField size="small" label="名称" value={name} onChange={(e) => setName(e.target.value)} />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>类型</InputLabel>
        <Select value={type} label="类型" onChange={(e) => setType(e.target.value as ProviderType)}>
          {['openai', 'moonshot', 'deepseek', 'minimax', 'anthropic', 'ollama', 'mock'].map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField size="small" label="Base URL" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} />
      <TextField size="small" label="API Key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      <Button variant="contained" onClick={() => void submit()} disabled={!name || !baseUrl}>
        添加
      </Button>
    </Box>
  );
}
