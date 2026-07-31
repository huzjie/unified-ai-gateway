import { DataTable, type Column } from '../Tables/DataTable';
import { StatusBadge } from '../Common/StatusBadge';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type { Provider } from '../../types';

export interface ProviderListProps {
  providers: Provider[];
  onRemove: (id: string) => void;
  onTest: (id: string) => void;
}

export function ProviderList({ providers, onRemove, onTest }: ProviderListProps) {
  const columns: Array<Column<Provider>> = [
    { key: 'name', header: '名称', render: (p) => p.name },
    { key: 'type', header: '类型', render: (p) => p.type },
    { key: 'baseUrl', header: 'Base URL', render: (p) => <code>{p.baseUrl}</code> },
    { key: 'enabled', header: '状态', render: (p) => <StatusBadge status={p.enabled} /> },
    { key: 'healthStatus', header: '健康', render: (p) => <StatusBadge status={p.healthStatus ?? 'unknown'} /> },
    { key: 'models', header: '模型数', render: (p) => p.models?.length ?? 0 },
    {
      key: 'actions',
      header: '操作',
      render: (p) => (
        <>
          <Tooltip title="测试连接">
            <IconButton size="small" onClick={() => onTest(p.id)}>
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="删除">
            <IconButton size="small" color="error" onClick={() => onRemove(p.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];
  return <DataTable columns={columns} rows={providers} rowKey={(p) => p.id} />;
}
