import crypto from 'crypto-random-string';
import { Header, Image, Grid } from 'semantic-ui-react';
import Layout from '~/components/Layout';
import ApiMessage from '~/components/ApiMessage';
import bcrypt from 'bcryptjs';
import { ActionFunction, json } from '@remix-run/node';
import { commitSession, getSession } from '~/session.server';
import { db } from '~/utils.server';
import i18n from '@iresucito/translations';

export let action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const body = await request.formData();
  let email = body.get('email') as string;
  const password = body.get('password') as string;
  if (!email || !password) {
    return json(
      {
        error: 'Provide an email and password to register',
      },
      { status: 500 }
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
        error: `Email ${email} already registered!`,
      },
      { status: 500 }
    );
  }
  try {
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    if (!exists) {
      // Crear usuario
      // @ts-ignore
      db.data.users.push({
        email,
        password: hash,
        isVerified: false,
        createdAt: Date.now(),
      });
    }
    // Crear (o actualizar) token para verificacion
    const token = crypto({ length: 20, type: 'url-safe' });
    // @ts-ignore
    let tokenIndex = db.data.tokens.findIndex(
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
      db.data.tokens[tokenIndex].token = token;
    }
    // Escribir
    db.write();
    const base =
      process.env.NODE_ENV == 'production'
        ? 'http://iresucito.vercel.app'
        : 'http://localhost:3000';

    try {
      await mailSender({
        to: email,
        text: `Navigate this link ${base}/verify?token=${token}&email=${email} to activate your account.`,
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
        error: `There was an error sending an email: ${(err as Error).message}`,
      });
    }
  } catch (err) {
    console.log({ err });
    return json(
      {
        error: err,
      },
      { status: 500 }
    );
  }
};

const Signup = () => {
  return (
    <Layout>
      <div style={{ padding: 30, width: 500, margin: 'auto' }}>
        <Image centered circular src="cristo.png" />
        <Header textAlign="center">
          iResucito
          <Header.Subheader>{i18n.t('ui.signup')}</Header.Subheader>
        </Header>
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column>
            <ApiMessage />
          </Grid.Column>
        </Grid>
      </div>
    </Layout>
  );
};

export default Signup;
