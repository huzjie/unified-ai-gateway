import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { routesApi } from '../../api-client/routes-api';
import { useToast } from '../../hooks/use-toast';
import type { RouteStrategy } from '../../types';

export interface RouteDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export function RouteDialog({ open, onClose, onSaved }: RouteDialogProps) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [matchModel, setMatchModel] = useState('');
  const [strategy, setStrategy] = useState<RouteStrategy>('priority');
  const [targets, setTargets] = useState('');

  const submit = async () => {
    try {
      await routesApi.create({
        name,
        matchModel: matchModel || null,
        strategy,
        targets: targets.split(',').map((s) => s.trim()).filter(Boolean),
      });
      toast.success('路由规则已创建');
      onSaved();
      onClose();
    } catch {
      toast.error('创建失败');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>新建路由规则</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <TextField label="规则名" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
        <TextField label="匹配模型（* 通配）" value={matchModel} onChange={(e) => setMatchModel(e.target.value)} fullWidth />
        <FormControl fullWidth>
          <InputLabel>策略</InputLabel>
          <Select value={strategy} label="策略" onChange={(e) => setStrategy(e.target.value as RouteStrategy)}>
            <MenuItem value="priority">优先级</MenuItem>
            <MenuItem value="failover">故障转移</MenuItem>
            <MenuItem value="cost-first">成本优先</MenuItem>
            <MenuItem value="random">随机</MenuItem>
          </Select>
        </FormControl>
        <TextField label="目标 Provider（逗号分隔）" value={targets} onChange={(e) => setTargets(e.target.value)} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button variant="contained" onClick={() => void submit()} disabled={!name || !targets}>
          创建
        </Button>
      </DialogActions>
    </Dialog>
  );
}
