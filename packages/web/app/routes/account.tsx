import {
  Link,
  useLoaderData,
  useSearchParams,
  useSubmit,
  useNavigation,
} from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { authenticator } from '~/auth.server';
import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Avatar,
  Grid,
  Alert,
  Paper,
  CircularProgress,
} from '@mui/material';
import Layout from '~/components/Layout';
import ErrorDetail from '~/components/ErrorDetail';
import ApiMessage from '~/components/ApiMessage';
import { useApp } from '~/app.context';
import { commitSession, getSession } from '~/session.server';
import i18n from '@iresucito/translations';

export let action: ActionFunction = async ({ request }) => {
  try {
    const user = await authenticator.authenticate('lowdb', request);
    let session = await getSession(request.headers.get('cookie'));
    session.set('user', user);
    session.unset('auth: error');
    let headers = new Headers({
      'Set-Cookie': await commitSession(session),
    });
    return new Response(null, { headers });
  } catch (err: any) {
    console.log(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 401,
    });
  }
};

export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get('cookie'));
  const user = session.get('user') as AuthData;
  if (user) {
    return redirect('/list');
  }
  return {
    error: session.get('auth:error'),
  };
};

export function meta() {
  return [{ title: i18n.t('ui.login') }];
}

const Account = () => {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const app = useApp();
  const submit = useSubmit();
  const [email, setEmail] = useState(searchParams.get('u') || '');
  const [password, setPassword] = useState('');

  const authenticate = () => {
    submit({ email, password }, { method: 'post' });
  };

  const signUp = () => {
    submit({ email, password }, { action: '/signup', method: 'post' });
  };

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
              <ApiMessage />
              {searchParams.get('v') !== null && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {i18n.t('ui.account verified')}
                </Alert>
              )}
              {searchParams.get('r') !== null && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {i18n.t('ui. password changed')}
                </Alert>
              )}

              {!app.user && (
                <Paper sx={{ p: 3, mt: 2 }}>
                  <Box
                    component="form"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}>
                    <TextField
                      fullWidth
                      label={i18n.t('ui.email')}
                      type="email"
                      placeholder={i18n.t('ui.email')}
                      value={email}
                      disabled={navigation.state !== 'idle'}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="username"
                      variant="outlined"
                    />

                    <TextField
                      fullWidth
                      label={i18n.t('ui.password')}
                      type="password"
                      value={password}
                      disabled={navigation.state !== 'idle'}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      variant="outlined"
                    />

                    <Divider sx={{ my: 1 }} />

                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={navigation.state !== 'idle'}
                      onClick={authenticate}
                      sx={{ position: 'relative' }}>
                      {navigation.state === 'submitting' && (
                        <CircularProgress
                          size={24}
                          sx={{
                            position: 'absolute',
                            left: '50%',
                            marginLeft: '-12px',
                          }}
                        />
                      )}
                      {i18n.t('ui.login')}
                    </Button>

                    <Divider sx={{ my: 1 }}>OR</Divider>

                    <Button
                      fullWidth
                      variant="outlined"
                      color="primary"
                      size="large"
                      disabled={navigation.state !== 'idle'}
                      onClick={signUp}>
                      {i18n.t('ui.signup')}
                    </Button>

                    <Link
                      to="/resetpassword"
                      style={{
                        textAlign: 'center',
                        marginTop: '16px',
                        textDecoration: 'none',
                      }}>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}>
                        {i18n.t('ui.forgot password')}
                      </Typography>
                    </Link>
                  </Box>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default Account;
