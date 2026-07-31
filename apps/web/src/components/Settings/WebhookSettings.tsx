import { Box, TextField, FormControlLabel, Switch, Button, Typography } from '@mui/material';
import { useState } from 'react';
import type { SystemSettings } from '../../types';

export interface WebhookSettingsProps {
  settings: SystemSettings;
  onSave: (patch: Partial<SystemSettings>) => Promise<void>;
}

export function WebhookSettings({ settings, onSave }: WebhookSettingsProps) {
  const [url, setUrl] = useState(settings.webhookUrl ?? '');
  const [alerts, setAlerts] = useState({
    rateLimited: settings.alertRateLimited,
    circuitOpen: settings.alertCircuitOpen,
    quota: settings.alertQuotaExceeded,
  });

  const save = async () => {
    await onSave({
      webhookUrl: url || null,
      alertRateLimited: alerts.rateLimited,
      alertCircuitOpen: alerts.circuitOpen,
      alertQuotaExceeded: alerts.quota,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        告警 Webhook
      </Typography>
      <TextField label="Webhook URL" value={url} onChange={(e) => setUrl(e.target.value)} fullWidth sx={{ mb: 1 }} />
      <FormControlLabel control={<Switch checked={alerts.rateLimited} onChange={(e) => setAlerts({ ...alerts, rateLimited: e.target.checked })} />} label="限流告警" />
      <FormControlLabel control={<Switch checked={alerts.circuitOpen} onChange={(e) => setAlerts({ ...alerts, circuitOpen: e.target.checked })} />} label="熔断告警" />
      <FormControlLabel control={<Switch checked={alerts.quota} onChange={(e) => setAlerts({ ...alerts, quota: e.target.checked })} />} label="配额告警" />
      <Box sx={{ mt: 1 }}>
        <Button variant="contained" onClick={() => void save()}>保存</Button>
      </Box>
    </Box>
  );
}
