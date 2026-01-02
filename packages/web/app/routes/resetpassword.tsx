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
import { useSubmit, useNavigation } from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';
import { json } from '@vercel/remix';
import Layout from '~/components/Layout';
import { db, mailSender } from '~/utils.server';
import i18n from '@iresucito/translations';
import ApiMessage from '~/components/ApiMessage';
import { useState } from 'react';

export let action: ActionFunction = async ({
  request,
}) => {
  const body = await request.formData();
  const email = body.get('email') as string;
  // @ts-ignore
  const userIndex = db.data. users.findIndex(
    (u) => u.email == email
  );
  if (userIndex === -1) {
    return json(
      {
        error: 'Email not found.',
      },
      { status: 500 }
    );
  }
  // Crear (o actualizar) token para verificacion
  const token = crypto({ length: 20, type: 'url-safe' });
  // @ts-ignore
  let tokenIndex = db.data.tokens. findIndex(
    (t) => t.email == email
  );
  if (tokenIndex === -1) {
    // @ts-ignore
    db. data.tokens.push({
      email,
      token,
    });
  } else {
    // @ts-ignore
    db.data.tokens[tokenIndex].token = token;
  }
  // Escribir
  db.write();
  const base =
    process.env.NODE_ENV == 'production'
      ? 'http://iresucito.vercel.app'
      : 'http://localhost:3000';
  try {
    console.log('Sending email.. .');
    await mailSender({
      to: email,
      text: `Navigate this link ${base}/changepassword?token=${token}&email=${email} to reset your password.`,
    });
    console.log('Done! ');
    return json({
      ok: `Reset password email sent! .  
Open your inbox and navigate the reset password link
on the email we've just sent to you! `,
    });
  } catch (err) {
    return json({
      error: `There was an error sending an email: ${
        (err as Error).message
      }`,
    });
  }
};

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const submit = useSubmit();
  const navigation = useNavigation();

  const handleReset = () => {
    submit({ email }, { method: 'post' });
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
                    flexDirection:  'column',
                    gap: 2,
                  }}>
                  <TextField
                    fullWidth
                    label={i18n.t('ui. email')}
                    type="email"
                    placeholder={i18n.t('ui. email')}
                    value={email}
                    onChange={(e) =>
                      setEmail(e. target.value)
                    }
                    autoComplete="email"
                    variant="outlined"
                  />

                  <Divider sx={{ my: 1 }} />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={
                      !email ||
                      navigation.state !== 'idle'
                    }
                    onClick={handleReset}
                    sx={{
                      position: 'relative',
                    }}>
                    {navigation.state ===
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
                    {i18n.t('ui. reset password')}
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

export default ResetPassword;