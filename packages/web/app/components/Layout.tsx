import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  Typography,
  Container,
} from '@mui/material';
import LocalePicker from './LocalePicker';
import EditSongTitle from './EditSongTitle';
import AppActions from './AppActions';
import { Link } from '@remix-run/react';

const Layout = (props: any) => {
  const { children } = props;

  return (
    <>
      <AppBar position="static" sx={{ mb: 1 }}>
        <Toolbar>
          <Link
            to="/list"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
            }}>
            <Avatar
              src="/cristo.png"
              sx={{
                width: 35,
                height: 35,
                mr: 1,
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              iResucito Web
            </Typography>
          </Link>

          <LocalePicker />
          <EditSongTitle />

          <Box sx={{ ml: 'auto' }}>
            <AppActions />
          </Box>
        </Toolbar>
      </AppBar>
      {children}
    </>
  );
};

export default Layout;
