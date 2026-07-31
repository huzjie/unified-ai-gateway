import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import type { SystemSettings } from '../../types';

export interface SettingsDialogProps {
  open: boolean;
  settings: SystemSettings | null;
  onClose: () => void;
}

export function SettingsDialog({ open, settings, onClose }: SettingsDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>系统设置</DialogTitle>
      <DialogContent>
        {settings && (
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(settings, null, 2)}</pre>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
}
