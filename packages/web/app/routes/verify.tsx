import { LoaderFunction, redirect } from '@remix-run/node';
import { json } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import { Typography, Avatar, Grid, Container, Box } from '@mui/material';
import ErrorDetail from '~/components/ErrorDetail';
import Layout from '~/components/Layout';
import { db } from '~/utils.server';

export let loader:  LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') as string;
  const email = url.searchParams.get('email') as string;
  if (!token || !email) {
    throw new Error('Missing parameters');
  }
  // @ts-ignore
  const userIndex = db.data.users.findIndex((x) => x.email === email);
  if (userIndex !== -1) {
    // @ts-ignore
    const user = db.data.users[userIndex];
    if (user.isVerified) {
      return json({ ok: 'Email Already Verified' });
    }
    // @ts-ignore
    const tokenIndex = db.data.tokens. findIndex(
      (t) => t.email === email && t.token === token
    );
    if (tokenIndex !== -1) {
      // @ts-ignore
      db.data.users[userIndex].isVerified = true;
      // @ts-ignore
      db. data.tokens. splice(tokenIndex, 1);
      db.write();
      return redirect(`/account?u=${email}&v=1`);
    }
    return json({ error: { message: 'Token expired' } });
  }
  return json({ error: { message:  'E-mail not found' } });
};

const Verify = () => {
  const data = useLoaderData<typeof loader>();

  return (
    <Layout>
      <Container maxWidth="sm">
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Avatar
            src="/cristo.png"
            sx={{
              width: 100,
              height: 100,
              margin: '0 auto',
              mb: 2,
            }}
          />
          <Typography variant="h4" gutterBottom>
            iResucito
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              {data.error && <ErrorDetail error={data.error} simple />}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default Verify;