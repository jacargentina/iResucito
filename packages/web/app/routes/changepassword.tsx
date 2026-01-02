import { useLoaderData, useSubmit, useNavigation } from '@remix-run/react';
import { redirect, ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@vercel/remix';
import {
  Container,
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  Avatar,
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import * as bcrypt from 'bcryptjs';
import Layout from '~/components/Layout';
import ApiMessage from '~/components/ApiMessage';
import { db } from '~/utils.server';
import i18n from '@iresucito/translations';
import ErrorDetail from '~/components/ErrorDetail';
import { commitSession, getSession } from '~/session.server';

export let action: ActionFunction = async ({ request, context, params }) => {
  const body = await request.formData();

  let userIndex = -1;
  if (body.get('email') && body.get('token')) {
    // @ts-ignore
    const tokenIndex = db.data.tokens.findIndex(
      (t) => t.email === body.get('email') && t.token === body.get('token')
    );
    if (tokenIndex == -1) {
      throw new Error('Token and email invalid.');
    }
    db.data?.tokens.splice(tokenIndex, 1);
    db.write();
    // @ts-ignore
    userIndex = db.data.users.findIndex((u) => u.email == body.get('email'));
  } else {
    let session = await getSession(request.headers.get('cookie'));
    const authData = session.get('user') as AuthData;
    if (authData == null) {
      throw new Error('No autenticado.');
    }
    // @ts-ignore
    userIndex = db.data.users.findIndex((u) => u.email == authData?.user);
  }

  if (userIndex === -1) {
    throw new Error('Usuario inválido.');
  }
  // @ts-ignore
  db.data.users[userIndex].password = bcrypt.hashSync(
    body.get('newPassword') as string,
    bcrypt.genSaltSync(10)
  );
  db.write();
  if (body.get('token') && body.get('email')) {
    return redirect(`/account?u=${body.get('email')}&r=1`);
  }
  let session = await getSession(request.headers.get('Cookie'));
  session.set('user', null);
  return redirect('/account? r=1', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const email = url.searchParams.get('email');
  if (token && email) {
    // @ts-ignore
    let tokenIndex = db.data.tokens.findIndex(
      (t) => t.email == email && t.token == token
    );
    if (tokenIndex !== -1) {
      return json({ token, email });
    }
    return json({
      error: 'Token and/or email are invalid.',
    });
  }
  return {};
};

export function meta() {
  return [{ title: i18n.t('ui.change password') }];
}

const ChangePassword = () => {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const navigation = useNavigation();
  const [changePassEnabled, setChangePassEnabled] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    setChangePassEnabled(
      newPassword.length >= 6 && newPassword === confirmNewPassword
    );
  }, [newPassword, confirmNewPassword]);

  const handleChangePassword = () => {
    if (changePassEnabled) {
      submit(
        {
          newPassword,
          token: data.token,
          email: data.email,
        },
        { method: 'post' }
      );
    }
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
              {data.error && (
                <ErrorDetail error={{ message: data.error }} simple />
              )}
              <ApiMessage />

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
                    label={i18n.t('ui. new password')}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    helperText={
                      newPassword.length > 0 && newPassword.length < 6
                        ? i18n.t('ui.password must be at least 6 characters')
                        : ''
                    }
                    error={newPassword.length > 0 && newPassword.length < 6}
                  />

                  <TextField
                    fullWidth
                    label={i18n.t('ui.confirm new password')}
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    helperText={
                      confirmNewPassword.length > 0 &&
                      newPassword! == confirmNewPassword
                        ? i18n.t('ui.passwords do not match')
                        : ''
                    }
                    error={
                      confirmNewPassword.length > 0 &&
                      newPassword! == confirmNewPassword
                    }
                  />

                  <Divider sx={{ my: 1 }} />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={!changePassEnabled || navigation.state !== 'idle'}
                    onClick={handleChangePassword}
                    sx={{
                      position: 'relative',
                    }}>
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
                    {i18n.t('ui. change password')}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default ChangePassword;
