import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#9a0036'
    },
    emergency: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828'
    },
    safe: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20'
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600
        },
        containedPrimary: {
          '&:hover': {
            boxShadow: '0 6px 12px rgba(25,118,210,0.2)'
          }
        },
        containedError: {
          '&:hover': {
            boxShadow: '0 6px 12px rgba(211,47,47,0.2)'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8
          }
        }
      }
    }
  },
  typography: {
    h6: {
      fontWeight: 600,
      letterSpacing: 0.5
    },
    button: {
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 8
  }
}); 