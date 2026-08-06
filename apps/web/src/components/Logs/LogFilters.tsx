import { Box, Button, MenuItem, TextField } from '@mui/material';

export interface LogFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  model: string;
  onModelChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
}

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: '200', label: '200' },
  { value: '400', label: '400' },
  { value: '401', label: '401' },
  { value: '429', label: '429' },
  { value: '500', label: '500' },
];

export function LogFilters({
  search,
  onSearchChange,
  model,
  onModelChange,
  status,
  onStatusChange,
  onRefresh,
}: LogFiltersProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
        size="small"
        label="搜索"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 220 }}
      />
      <TextField
        size="small"
        label="模型"
        value={model}
        onChange={(e) => onModelChange(e.target.value)}
        sx={{ minWidth: 160 }}
      />
      <TextField
        size="small"
        select
        label="状态"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        sx={{ minWidth: 130 }}
      >
        {STATUS_OPTIONS.map((o) => (
          <MenuItem key={o.value} value={o.value}>
            {o.label}
          </MenuItem>
        ))}
      </TextField>
      <Button size="small" variant="outlined" onClick={onRefresh}>
        刷新
      </Button>
    </Box>
  );
}
