import { DataTable, type Column } from '../Tables/DataTable';
import { StatusBadge } from '../Common/StatusBadge';
import { IconButton, Tooltip, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { RouteRule } from '../../types';

export interface RouteListProps {
  routes: RouteRule[];
  onRemove: (id: string) => void;
}

export function RouteList({ routes, onRemove }: RouteListProps) {
  const columns: Array<Column<RouteRule>> = [
    { key: 'name', header: '规则名', render: (r) => r.name },
    { key: 'priority', header: '优先级', render: (r) => r.priority },
    { key: 'matchModel', header: '匹配模型', render: (r) => r.matchModel ?? '*' },
    { key: 'matchTenant', header: '匹配租户', render: (r) => r.matchTenant ?? '*' },
    { key: 'strategy', header: '策略', render: (r) => <Chip size="small" label={r.strategy} /> },
    { key: 'targets', header: '目标', render: (r) => r.targets.join(' → ') },
    { key: 'enabled', header: '状态', render: (r) => <StatusBadge status={r.enabled ? 'enabled' : 'disabled'} /> },
    {
      key: 'actions',
      header: '操作',
      render: (r) => (
        <Tooltip title="删除">
          <IconButton size="small" color="error" onClick={() => onRemove(r.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
  return <DataTable columns={columns} rows={routes} rowKey={(r) => r.id} />;
}
