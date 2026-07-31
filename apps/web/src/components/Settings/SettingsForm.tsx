import { Box, TextField, Button, Typography } from '@mui/material';
import { useState } from 'react';
import type { SystemSettings } from '../../types';

export interface SettingsFormProps {
  settings: SystemSettings;
  onSave: (patch: Partial<SystemSettings>) => Promise<void>;
}

export function SettingsForm({ settings, onSave }: SettingsFormProps) {
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof SystemSettings, value: string | number) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave({
        defaultTimeoutMs: Number(form.defaultTimeoutMs),
        defaultMaxRetries: Number(form.defaultMaxRetries),
        breakerFailureThreshold: Number(form.breakerFailureThreshold),
        globalQps: Number(form.globalQps),
        globalConcurrency: Number(form.globalConcurrency),
        logRetentionDays: Number(form.logRetentionDays),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        全局默认
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box>
          <TextField label="默认超时(ms)" type="number" value={form.defaultTimeoutMs} onChange={(e) => set('defaultTimeoutMs', Number(e.target.value))} fullWidth />
        </Box>
        <Box>
          <TextField label="默认重试" type="number" value={form.defaultMaxRetries} onChange={(e) => set('defaultMaxRetries', Number(e.target.value))} fullWidth />
        </Box>
        <Box>
          <TextField label="熔断失败阈值" type="number" value={form.breakerFailureThreshold} onChange={(e) => set('breakerFailureThreshold', Number(e.target.value))} fullWidth />
        </Box>
        <Box>
          <TextField label="全局 QPS" type="number" value={form.globalQps} onChange={(e) => set('globalQps', Number(e.target.value))} fullWidth />
        </Box>
        <Box>
          <TextField label="全局并发" type="number" value={form.globalConcurrency} onChange={(e) => set('globalConcurrency', Number(e.target.value))} fullWidth />
        </Box>
        <Box>
          <TextField label="日志保留天数" type="number" value={form.logRetentionDays} onChange={(e) => set('logRetentionDays', Number(e.target.value))} fullWidth />
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={() => void save()} disabled={saving}>
          保存
        </Button>
      </Box>
    </Box>
  );
}
