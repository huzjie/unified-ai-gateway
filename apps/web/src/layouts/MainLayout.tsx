import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Layout/Sidebar';
import { Topbar } from '../components/Layout/Topbar';
import { Footer } from '../components/Layout/Footer';
import { Breadcrumbs } from '../components/Layout/Breadcrumbs';

/** 主布局：左侧导航 + 顶栏 */
export function MainLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', ml: { xs: 0, md: '240px' } }}>
        <Topbar />
        <Breadcrumbs />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
