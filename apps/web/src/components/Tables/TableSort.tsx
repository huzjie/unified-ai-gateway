import { TableSortLabel } from '@mui/material';

export interface TableSortProps {
  field: string;
  activeField: string | null;
  order: 'asc' | 'desc';
  onClick: (field: string) => void;
  children: React.ReactNode;
}

export function TableSort({ field, activeField, order, onClick, children }: TableSortProps) {
  return (
    <TableSortLabel
      active={activeField === field}
      direction={activeField === field ? order : 'asc'}
      onClick={() => onClick(field)}
    >
      {children}
    </TableSortLabel>
  );
}
