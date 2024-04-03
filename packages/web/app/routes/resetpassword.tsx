import crypto from 'crypto-random-string';
import {
  Header,
  Segment,
  Button,
  Divider,
  Input,
  Image,
  Form,
  Grid,
} from 'semantic-ui-react';
import { useSubmit, useNavigation } from '@remix-run/react';
import { ActionFunction } from '@remix-run/node';
import { json } from '@vercel/remix';
import Layout from '~/components/Layout';
import { db } from '~/utils.server';
import i18n from '@iresucito/translations';
import ApiMessage from '~/components/ApiMessage';
import { useState } from 'react';

export let action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const email = body.get('email') as string;
  // @ts-ignore
  const userIndex = db.data.users.findIndex((u) => u.email == email);
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
  let tokenIndex = db.data.tokens.findIndex((t) => t.email == email);
  if (tokenIndex === -1) {
    // @ts-ignore
    db.data.tokens.push({
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
    console.log('Sending email...');
    await mailSender({
      to: email,
      text: `Navigate this link ${base}/changepassword?token=${token}&email=${email} to reset your password.`,
    });
    console.log('Done!');
    return json({
      ok: `Reset password email sent!. 
Open your inbox and navigate the reset password link
on the email we've just sent to you!`,
    });
  } catch (err) {
    return json({
      error: `There was an error sending an email: ${(err as Error).message}`,
    });
  }
};

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const submit = useSubmit();
  const navigation = useNavigation();
  return (
    <Layout>
      <div style={{ padding: 30, width: 500, margin: 'auto' }}>
        <Image centered circular src="cristo.png" />
        <Header textAlign="center">iResucito</Header>
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column>
            <ApiMessage />
            <Form size="large">
              <Segment vertical>
                <Form.Field>
                  <Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder={i18n.t('ui.email')}
                    value={email}
                    onChange={(e, { value }) => {
                      setEmail(value);
                    }}
                    autoComplete="username"
                  />
                </Form.Field>
                <Divider hidden />
                <Button
                  primary
                  size="large"
                  loading={navigation.state !== 'idle'}
                  onClick={() => submit({ email }, { method: 'post' })}>
                  {i18n.t('ui.reset password')}
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    </Layout>
  );
};

export default ResetPassword;
