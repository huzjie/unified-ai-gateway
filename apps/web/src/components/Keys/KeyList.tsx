import { DataTable, type Column } from '../Tables/DataTable';
import { StatusBadge } from '../Common/StatusBadge';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ApiKey } from '../../types';

export interface KeyListProps {
  keys: ApiKey[];
  onRevoke: (id: string) => void;
}

export function KeyList({ keys, onRevoke }: KeyListProps) {
  const columns: Array<Column<ApiKey>> = [
    { key: 'name', header: '名称', render: (k) => k.name },
    { key: 'keyPrefix', header: 'Key 前缀', render: (k) => <code>{k.keyPrefix}...</code> },
    { key: 'tenant', header: '租户/团队', render: (k) => k.tenant },
    { key: 'status', header: '状态', render: (k) => <StatusBadge status={k.status} /> },
    { key: 'qpsLimit', header: 'QPS', render: (k) => k.qpsLimit },
    { key: 'createdAt', header: '创建时间', render: (k) => k.createdAt.slice(0, 10) },
    {
      key: 'actions',
      header: '操作',
      render: (k) => (
        <Tooltip title="吊销">
          <IconButton size="small" color="error" onClick={() => onRevoke(k.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
  return <DataTable columns={columns} rows={keys} rowKey={(k) => k.id} />;
}
