import crypto from 'crypto-random-string';
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
import Layout from '~/components/Layout';
import ApiMessage from '~/components/ApiMessage';
import bcrypt from 'bcryptjs';
import { ActionFunction } from '@remix-run/node';
import { json } from '@vercel/remix';
import { commitSession, getSession } from '~/session.server';
import { db, mailSender } from '~/utils.server';
import i18n from '@iresucito/translations';
import { useNavigation } from '@remix-run/react';
import { useState } from 'react';

export let action: ActionFunction = async ({
  request,
}) => {
  const session = await getSession(
    request.headers.get('Cookie')
  );
  const body = await request.formData();
  let email = body.get('email') as string;
  const password = body.get('password') as string;
  if (! email || !password) {
    return json(
      {
        error: 'Provide an email and password to register',
      },
      { status:  500 }
    );
  }
  if (email.indexOf('@') === -1) {
    return json(
      {
        error: 
          'E-mail address has an invalid format. Please correct its value.',
      },
      { status: 500 }
    );
  }
  // Quitar espacios
  email = email.trim();
  // @ts-ignore
  const exists = db.data.users.find((u) => u.email == email);
  if (exists && exists.isVerified) {
    return json(
      {
        error:  `Email ${email} already registered! `,
      },
      { status: 500 }
    );
  }
  try {
    const hash = bcrypt.hashSync(
      password,
      bcrypt. genSaltSync(10)
    );
    if (! exists) {
      // Crear usuario
      // @ts-ignore
      db. data.users.push({
        email,
        password: hash,
        isVerified: false,
        createdAt: Date.now(),
      });
    }
    // Crear (o actualizar) token para verificacion
    const token = crypto({ length: 20, type: 'url-safe' });
    // @ts-ignore
    let tokenIndex = db.data.tokens. findIndex(
      (t) => t.email == email
    );
    if (tokenIndex === -1) {
      // @ts-ignore
      db.data.tokens.push({
        email,
        token,
      });
    } else {
      // @ts-ignore
      db. data.tokens[tokenIndex].token = token;
    }
    // Escribir
    db. write();
    const base =
      process.env.NODE_ENV == 'production'
        ?  'http://iresucito.vercel.app'
        : 'http://localhost:3000';

    try {
      await mailSender({
        to:  email,
        text: `Navigate this link ${base}/verify? token=${token}&email=${email} to activate your account.`,
      });
      return json(
        {
          ok: `User registered.  
Open your inbox and activate your account 
with the email we've just sent to you!`,
        },
        {
          headers: {
            'Set-Cookie': await commitSession(session),
          },
        }
      );
    } catch (err) {
      return json({
        error: `There was an error sending an email: ${
          (err as Error).message
        }`,
      });
    }
  } catch (err) {
    console.log({ err });
    return json(
      {
        error: err,
      },
      { status:  500 }
    );
  }
};

const Signup = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    password.length >= 6;

  const handleSignup = () => {
    if (isFormValid) {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      // Use navigator or form submission
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

          <Grid
            container
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Grid item xs={12}>
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
                    label={i18n.t('ui.email')}
                    type="email"
                    placeholder={i18n. t('ui.email')}
                    value={email}
                    disabled={
                      navigation.state !== 'idle'
                    }
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    autoComplete="email"
                    variant="outlined"
                  />

                  <TextField
                    fullWidth
                    label={i18n.t('ui.password')}
                    type="password"
                    value={password}
                    disabled={
                      navigation.state !== 'idle'
                    }
                    onChange={(e) =>
                      setPassword(e. target.value)
                    }
                    helperText={
                      password. length > 0 &&
                      password.length < 6
                        ? i18n.t(
                            'ui.password must be at least 6 characters'
                          )
                        :  ''
                    }
                    error={
                      password.length > 0 &&
                      password.length < 6
                    }
                    autoComplete="new-password"
                  />

                  <TextField
                    fullWidth
                    label={i18n.t(
                      'ui.confirm password'
                    )}
                    type="password"
                    value={confirmPassword}
                    disabled={
                      navigation.state !== 'idle'
                    }
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    helperText={
                      confirmPassword.length > 0 &&
                      password ! ==
                        confirmPassword
                        ? i18n.t(
                            'ui.passwords do not match'
                          )
                        : ''
                    }
                    error={
                      confirmPassword.length > 0 &&
                      password ! ==
                        confirmPassword
                    }
                    autoComplete="new-password"
                  />

                  <Divider sx={{ my: 1 }} />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={
                      !isFormValid ||
                      navigation. state !== 'idle'
                    }
                    onClick={handleSignup}
                    sx={{
                      position: 'relative',
                    }}>
                    {navigation. state ===
                      'submitting' && (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: 'absolute',
                          left: '50%',
                          marginLeft: '-12px',
                        }}
                      />
                    )}
                    {i18n.t('ui.signup')}
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

export default Signup;