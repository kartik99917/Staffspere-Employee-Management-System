import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',      // Bright blue
      light: '#60a5fa',     // Lighter blue
      dark: '#2563eb',      // Darker blue
      contrastText: '#fff'
    },
    secondary: {
      main: '#64748b',      // Slate gray
      light: '#94a3b8',     // Light slate
      dark: '#475569',      // Dark slate
      contrastText: '#fff'
    },
    success: {
      main: '#22c55e',      // Green
      light: '#4ade80',     // Light green
      dark: '#16a34a'       // Dark green
    },
    error: {
      main: '#ef4444',      // Red
      light: '#f87171',     // Light red
      dark: '#dc2626'       // Dark red
    },
    warning: {
      main: '#f59e0b',      // Amber
      light: '#fbbf24',     // Light amber
      dark: '#d97706'       // Dark amber
    },
    info: {
      main: '#0ea5e9',      // Sky blue
      light: '#38bdf8',     // Light sky blue
      dark: '#0284c7'       // Dark sky blue
    },
    background: {
      default: '#0f172a',   // Dark blue-gray
      paper: '#1e293b'      // Slightly lighter blue-gray
    },
    text: {
      primary: '#f8fafc',   // Almost white
      secondary: '#cbd5e1'  // Light gray
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transform: 'translateY(-1px)'
          }
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #2563eb, #3b82f6)'
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #475569, #64748b)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          background: '#1e293b'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: '#1e293b'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500
        }
      }
    }
  }
});

export default theme; 