import { Box, Pagination as MuiPagination } from '@mui/material';

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
      <MuiPagination count={totalPages} page={page} onChange={(_, p) => onChange(p)} color="primary" />
    </Box>
  );
}
