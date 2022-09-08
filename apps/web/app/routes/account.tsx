import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  useLoaderData,
  useSearchParams,
  useSubmit,
  useTransition,
} from 'remix';
import { authenticator } from '~/auth.server';
import { useState, useEffect } from 'react';
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
  Modal,
} from 'semantic-ui-react';
import Layout from '~/components/Layout';
import ErrorDetail from '~/components/ErrorDetail';
import ApiMessage from '~/components/ApiMessage';
import { useApp } from '~/app.context';
import { commitSession, getSession } from '~/session.server';
import I18n from '~/translations';

export let action: ActionFunction = async ({ request }) => {
  return await authenticator.authenticate('lowdb', request, {
    successRedirect: '/list',
    failureRedirect: '/account',
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  return json(
    {
      error: session.get('auth:error'),
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};

export function meta() {
  return { title: I18n.t('ui.login') };
}

const Account = () => {
  const data = useLoaderData();
  const transition = useTransition();
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
              <Message positive>{I18n.t('ui.account verified')}</Message>
            )}
            {searchParams.get('r') !== null && (
              <Message positive>{I18n.t('ui.password changed')}</Message>
            )}
            {!app.user && (
              <Form size="large">
                <Segment vertical>
                  <Form.Field>
                    <Input
                      fluid
                      icon="user"
                      iconPosition="left"
                      readOnly={transition.state !== 'idle'}
                      placeholder={I18n.t('ui.email')}
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
                    readOnly={transition.state !== 'idle'}
                    placeholder={I18n.t('ui.password')}
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
                    loading={transition.state !== 'idle'}>
                    {I18n.t('ui.login')}
                  </Button>
                  <Button
                    basic
                    size="large"
                    onClick={() => {
                      signUp();
                    }}
                    disabled={transition.state !== 'idle'}>
                    {I18n.t('ui.signup')}
                  </Button>
                  <Divider hidden />
                  <Link to="/resetpassword">{I18n.t('ui.reset password')}</Link>
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
                <Link to="/changepassword">{I18n.t('ui.change password')}</Link>
              </>
            )}
          </Grid.Column>
        </Grid>
      </div>
    </Layout>
  );
};

export default Account;
