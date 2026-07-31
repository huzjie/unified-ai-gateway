import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth-store';

export function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch {
      setError('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="用户名/邮箱" value={username} onChange={(e) => setUsername(e.target.value)} fullWidth />
      <TextField label="密码" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth onKeyDown={(e) => e.key === 'Enter' && void submit()} />
      <Button variant="contained" size="large" onClick={() => void submit()} disabled={loading || !username || !password}>
        登 录
      </Button>
      <Typography variant="caption" color="text.secondary" align="center">
        首次使用？用 .env 中 ADMIN_* 初始化
      </Typography>
    </Box>
  );
}
