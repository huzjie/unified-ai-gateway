import { Chip } from '@mui/material';

export interface StatusBadgeProps {
  status: string;
}

const colorMap: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  healthy: 'success',
  active: 'success',
  enabled: 'success',
  ok: 'success',
  unhealthy: 'error',
  revoked: 'error',
  disabled: 'error',
  failure: 'error',
  expired: 'warning',
  checking: 'info',
  unknown: 'default',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Chip size="small" label={status} color={colorMap[status] ?? 'default'} />;
}
