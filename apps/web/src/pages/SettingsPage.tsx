import { Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { PageHeader } from '../components/Common/PageHeader';
import { SettingsForm } from '../components/Settings/SettingsForm';
import { WebhookSettings } from '../components/Settings/WebhookSettings';
import { DataSettings } from '../components/Settings/DataSettings';
import { AboutSection } from '../components/Settings/AboutSection';
import { Loading } from '../components/Common/Loading';
import { useSettings } from '../hooks/use-settings';
import { useToast } from '../hooks/use-toast';

export default function SettingsPage() {
  const [tab, setTab] = useState(0);
  const { settings, loading, update } = useSettings();
  const toast = useToast();

  if (loading && !settings) {
    return <Loading />;
  }
  if (!settings) {
    return null;
  }

  const save = async (patch: Parameters<typeof update>[0]) => {
    await update(patch);
    toast.success('设置已保存');
  };

  return (
    <Box>
      <PageHeader title="系统设置" description="全局默认 / 告警 / 数据 / 关于" />
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="全局默认" />
        <Tab label="告警" />
        <Tab label="数据" />
        <Tab label="关于" />
      </Tabs>
      <Box sx={{ pt: 3 }}>
        {tab === 0 && <SettingsForm settings={settings} onSave={save} />}
        {tab === 1 && <WebhookSettings settings={settings} onSave={save} />}
        {tab === 2 && <DataSettings />}
        {tab === 3 && <AboutSection />}
      </Box>
    </Box>
  );
}
