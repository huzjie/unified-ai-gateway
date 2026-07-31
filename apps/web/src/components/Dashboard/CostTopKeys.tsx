import { Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import type { DashboardData } from '../../types';

export function CostTopKeys({ data }: { data: DashboardData }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          成本 Top Key
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>租户</TableCell>
              <TableCell align="right">调用</TableCell>
              <TableCell align="right">成本</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.costTopKeys.map((k) => (
              <TableRow key={k.keyId}>
                <TableCell>{k.keyPrefix}</TableCell>
                <TableCell>{k.tenant}</TableCell>
                <TableCell align="right">{k.requests}</TableCell>
                <TableCell align="right">¥{(k.cost / 1_000_000).toFixed(4)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
