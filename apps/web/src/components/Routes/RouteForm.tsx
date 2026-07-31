import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import type { RouteStrategy } from '../../types';

export interface RouteFormProps {
  onSubmit: (input: { name: string; matchModel?: string; strategy: RouteStrategy; targets: string[] }) => Promise<void>;
}

export function RouteForm({ onSubmit }: RouteFormProps) {
  const [name, setName] = useState('');
  const [matchModel, setMatchModel] = useState('');
  const [strategy, setStrategy] = useState<RouteStrategy>('priority');
  const [targets, setTargets] = useState('');

  const submit = async () => {
    await onSubmit({ name, matchModel: matchModel || undefined, strategy, targets: targets.split(',').map((s) => s.trim()) });
    setName('');
    setTargets('');
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
      <TextField size="small" label="规则名" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField size="small" label="匹配模型" value={matchModel} onChange={(e) => setMatchModel(e.target.value)} />
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>策略</InputLabel>
        <Select value={strategy} label="策略" onChange={(e) => setStrategy(e.target.value as RouteStrategy)}>
          <MenuItem value="priority">优先级</MenuItem>
          <MenuItem value="failover">故障转移</MenuItem>
          <MenuItem value="cost-first">成本优先</MenuItem>
          <MenuItem value="random">随机</MenuItem>
        </Select>
      </FormControl>
      <TextField size="small" label="目标（逗号分隔）" value={targets} onChange={(e) => setTargets(e.target.value)} />
      <Button variant="contained" onClick={() => void submit()} disabled={!name || !targets}>
        创建
      </Button>
    </Box>
  );
}
