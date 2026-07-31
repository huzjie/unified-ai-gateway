import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>取消</Button>
        <Button color="error" variant="contained" onClick={onConfirm}>
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
}
