import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyIcon from '@mui/icons-material/Key';
import CloudIcon from '@mui/icons-material/Cloud';
import RouteIcon from '@mui/icons-material/AltRoute';
import LogIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import AuditIcon from '@mui/icons-material/VerifiedUser';
import ExportIcon from '@mui/icons-material/FileDownload';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: '仪表盘', icon: <DashboardIcon /> },
  { path: '/keys', label: 'API Keys', icon: <KeyIcon /> },
  { path: '/providers', label: 'Providers', icon: <CloudIcon /> },
  { path: '/routes', label: '路由规则', icon: <RouteIcon /> },
  { path: '/logs', label: '请求日志', icon: <LogIcon /> },
  { path: '/audit', label: '审计日志', icon: <AuditIcon /> },
  { path: '/export', label: '导出', icon: <ExportIcon /> },
  { path: '/settings', label: '系统设置', icon: <SettingsIcon /> },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box', bgcolor: '#111827' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
          UAG Console
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
