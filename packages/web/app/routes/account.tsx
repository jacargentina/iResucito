import {
  Link,
  useLoaderData,
  useSearchParams,
  useSubmit,
  useNavigation,
} from '@remix-run/react';
import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { json } from '@vercel/remix';
import { authenticator } from '~/auth.server';
import { useState } from 'react';
import {
  Header,
  Segment,
  Button,
  Divider,
  Input,
  Image,
  Form,
  Grid,
  Message,
} from 'semantic-ui-react';
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
    session.unset('auth:error');
    let headers = new Headers({ 'Set-Cookie': await commitSession(session) });
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
      <div style={{ padding: 30, width: 500, margin: 'auto' }}>
        <Image centered circular src="cristo.png" />
        <Header textAlign="center">iResucito</Header>
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column>
            {data.error && <ErrorDetail error={data.error} simple />}
            <ApiMessage />
            {searchParams.get('v') !== null && (
              <Message positive>{i18n.t('ui.account verified')}</Message>
            )}
            {searchParams.get('r') !== null && (
              <Message positive>{i18n.t('ui.password changed')}</Message>
            )}
            {!app.user && (
              <Form size="large">
                <Segment vertical>
                  <Form.Field>
                    <Input
                      fluid
                      icon="user"
                      iconPosition="left"
                      readOnly={navigation.state !== 'idle'}
                      placeholder={i18n.t('ui.email')}
                      value={email}
                      onChange={(e, { value }) => {
                        setEmail(value);
                      }}
                      autoComplete="username"
                    />
                  </Form.Field>
                  <Form.Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    readOnly={navigation.state !== 'idle'}
                    placeholder={i18n.t('ui.password')}
                    type="password"
                    value={password}
                    onChange={(e, { value }) => {
                      setPassword(value);
                    }}
                    autoComplete="current-password"
                  />
                  <Divider hidden />
                  <Button
                    primary
                    size="large"
                    onClick={authenticate}
                    loading={navigation.state !== 'idle'}>
                    {i18n.t('ui.login')}
                  </Button>
                  <Button
                    basic
                    size="large"
                    onClick={() => {
                      signUp();
                    }}
                    disabled={navigation.state !== 'idle'}>
                    {i18n.t('ui.signup')}
                  </Button>
                  <Divider hidden />
                  <Link to="/resetpassword">{i18n.t('ui.reset password')}</Link>
                </Segment>
              </Form>
            )}
            {app.user && (
              <>
                <div style={{ fontSize: '1.2em' }}>
                  <strong>Usuario:&nbsp;</strong>
                  <span>{app.user}</span>
                </div>
                <Divider hidden />
                <Link to="/changepassword">{i18n.t('ui.change password')}</Link>
              </>
            )}
          </Grid.Column>
        </Grid>
      </div>
    </Layout>
  );
};

export default Account;
