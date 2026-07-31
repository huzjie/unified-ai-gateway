import { Box, Button } from '@mui/material';
import { useState } from 'react';
import dayjs from 'dayjs';

export interface DateRangePickerProps {
  value: { start: string; end: string };
  onChange: (range: { start: string; end: string }) => void;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [start, setStart] = useState(value.start.slice(0, 10));
  const [end, setEnd] = useState(value.end.slice(0, 10));

  const apply = () => {
    onChange({ start: dayjs(start).toISOString(), end: dayjs(end).endOf('day').toISOString() });
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
      <span>至</span>
      <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
      <Button size="small" variant="outlined" onClick={apply}>
        应用
      </Button>
    </Box>
  );
}
