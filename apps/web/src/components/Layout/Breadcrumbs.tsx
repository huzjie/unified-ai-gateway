import { Breadcrumbs as MuiBreadcrumbs, Typography, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '../../router/guards';

export function Breadcrumbs() {
  const location = useLocation();
  const current = routes.find((r) => r.path === location.pathname);
  return (
    <Box sx={{ px: 3, pt: 2 }}>
      <MuiBreadcrumbs aria-label="breadcrumb">
        <Link to="/" style={{ color: '#1976d2', textDecoration: 'none' }}>
          首页
        </Link>
        {current && <Typography color="text.primary">{current.name}</Typography>}
      </MuiBreadcrumbs>
    </Box>
  );
}
