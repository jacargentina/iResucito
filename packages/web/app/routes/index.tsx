import { Box, CircularProgress, Typography } from '@mui/material';

const Index = () => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6">Loading...</Typography>
    </Box>
  );
};

export default Index;