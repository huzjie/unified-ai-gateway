import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { components } from './components';

/** MUI 主题（深色技术风格） */
export const theme = createTheme({
  palette,
  typography,
  components,
});
