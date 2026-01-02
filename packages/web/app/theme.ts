import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary:  {
      main: '#2185d0',
    },
    secondary: {
      main: '#1b1c1d',
    },
    success: {
      main: '#21ba45',
    },
    error: {
      main: '#db2828',
    },
    warning: {
      main: '#f2711c',
    },
    info: {
      main: '#0c5aa0',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1b1c1d',
        },
      },
    },
  },
});

export default theme;