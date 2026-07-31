import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { RequireAuth, GuestOnly } from './guards';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const KeysPage = lazy(() => import('../pages/KeysPage'));
const ProvidersPage = lazy(() => import('../pages/ProvidersPage'));
const RoutesPage = lazy(() => import('../pages/RoutesPage'));
const LogsPage = lazy(() => import('../pages/LogsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AuditPage = lazy(() => import('../pages/AuditPage'));
const ExportPage = lazy(() => import('../pages/ExportPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
      <CircularProgress />
    </Box>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<GuestOnly><AuthLayout><LoginPage /></AuthLayout></GuestOnly>} />
        <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/keys" element={<KeysPage />} />
          <Route path="/providers" element={<ProvidersPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/export" element={<ExportPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
