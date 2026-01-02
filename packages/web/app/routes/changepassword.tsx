import { useLoaderData, useSubmit } from '@remix-run/react';
import { redirect, ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@vercel/remix';
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
    const user = session.get('user') as AuthData;
    if (user == null) {
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
  return redirect('/account?r=1', {
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
    return json({ error: 'Token and/or email are invalid.' });
  }
  return {};
};

export function meta() {
  return [{ title: i18n.t('ui.change password') }];
}

const ChangePassword = () => {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [changePassEnabled, setChangePassEnabled] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  useEffect(() => {
    setChangePassEnabled(
      newPassword !== '' &&
        confirmNewPassword !== '' &&
        newPassword === confirmNewPassword
    );
  }, [newPassword, confirmNewPassword]);

  return (
    <Layout>
      <div style={{ padding: 30, width: 500, margin: 'auto' }}>
        <Image centered circular src="cristo.png" />
        <Header textAlign="center">
          iResucito
          <Header.Subheader>{i18n.t('ui.change password')}</Header.Subheader>
        </Header>
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column>
            {data.error && <ErrorDetail error={data.error} simple />}
            <ApiMessage />
            <Form size="large">
              <Segment vertical>
                <h5>{i18n.t('ui.new password')}</h5>
                <Input
                  fluid
                  autoFocus
                  value={newPassword}
                  onChange={(e, { value }) => {
                    setNewPassword(value);
                  }}
                  type="password"
                />
                <h5>{i18n.t('ui.confirm new password')}</h5>
                <Input
                  fluid
                  value={confirmNewPassword}
                  onChange={(e, { value }) => {
                    setConfirmNewPassword(value);
                  }}
                  type="password"
                />
                <Divider hidden />
                <Button
                  primary
                  disabled={!changePassEnabled}
                  onClick={() => {
                    submit({ newPassword, ...data }, { method: 'post' });
                  }}>
                  {i18n.t('ui.apply')}
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
    </Layout>
  );
};

export default ChangePassword;
