import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { PageHeader } from '../components/Common/PageHeader';
import { Loading } from '../components/Common/Loading';
import { ErrorState } from '../components/Common/ErrorState';
import { MetricCards } from '../components/Dashboard/MetricCards';
import { TrendChart } from '../components/Dashboard/TrendChart';
import { ModelShareChart } from '../components/Dashboard/ModelShareChart';
import { CostTopKeys } from '../components/Dashboard/CostTopKeys';
import { useDashboard } from '../hooks/use-dashboard';
import { useInterval } from '../hooks/use-interval';

export default function DashboardPage() {
  const [days, setDays] = useState(7);
  const { data, loading, fetch } = useDashboard(days);

  useInterval(() => void fetch(days), 30_000);

  if (loading && !data) {
    return <Loading />;
  }
  if (!data) {
    return <ErrorState />;
  }

  return (
    <Box>
      <PageHeader
        title="仪表盘"
        actions={
          <FormControl size="small">
            <InputLabel>时间范围</InputLabel>
            <Select value={days} label="时间范围" onChange={(e) => setDays(Number(e.target.value))}>
              <MenuItem value={1}>近 1 天</MenuItem>
              <MenuItem value={7}>近 7 天</MenuItem>
              <MenuItem value={30}>近 30 天</MenuItem>
            </Select>
          </FormControl>
        }
      />
      <MetricCards data={data} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <TrendChart data={data} />
        <ModelShareChart data={data} />
        <Box sx={{ gridColumn: '1 / -1' }}>
          <CostTopKeys data={data} />
        </Box>
      </Box>
    </Box>
  );
}
