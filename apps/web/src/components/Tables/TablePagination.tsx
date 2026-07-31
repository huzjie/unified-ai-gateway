import { Pagination as MuiPagination, Box } from '@mui/material';

export interface TablePaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function TablePagination({ page, totalPages, onChange }: TablePaginationProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
      <MuiPagination count={Math.max(1, totalPages)} page={page} onChange={(_, p) => onChange(p)} size="small" />
    </Box>
  );
}
