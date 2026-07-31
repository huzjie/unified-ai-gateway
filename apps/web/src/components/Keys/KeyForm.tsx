import { TextField, Button, Box } from '@mui/material';
import { useState } from 'react';

export interface KeyFormProps {
  onSubmit: (input: { name: string; tenant: string; qpsLimit: number }) => Promise<void>;
}

export function KeyForm({ onSubmit }: KeyFormProps) {
  const [name, setName] = useState('');
  const [tenant, setTenant] = useState('');
  const [qps, setQps] = useState('100');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await onSubmit({ name, tenant, qpsLimit: Number(qps) });
      setName('');
      setTenant('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <TextField size="small" label="名称" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField size="small" label="租户" value={tenant} onChange={(e) => setTenant(e.target.value)} />
      <TextField size="small" label="QPS" type="number" value={qps} onChange={(e) => setQps(e.target.value)} />
      <Button variant="contained" onClick={() => void submit()} disabled={submitting || !name || !tenant}>
        创建
      </Button>
    </Box>
  );
}
