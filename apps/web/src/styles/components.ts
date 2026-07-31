import type { Components } from '@mui/material/styles';

/** MUI 组件默认样式 */
export const components: Components = {
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: '#1e293b',
        borderRadius: 12,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      head: {
        fontWeight: 700,
      },
    },
  },
};
