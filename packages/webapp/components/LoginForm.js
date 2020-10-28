// @flow
import React, { useState, useContext, useEffect } from 'react';
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
import { useSession, signIn, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import { DataContext } from 'components/DataContext';
import ErrorDetail from 'components/ErrorDetail';
import ApiMessage from 'components/ApiMessage';
import I18n from '../../../translations';

const LoginForm = () => {
  const [session, isLoading] = useSession();
  const data = useContext(DataContext);
  const router = useRouter();
  const {
    query: { callbackUrl, u, v },
  } = router;
  const [email, setEmail] = useState(u || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const err =
      router.query.error === 'CredentialsSignin'
        ? new Error('User or password are invalid.')
        : router.query.error === 'AccountNotVerified'
        ? new Error('Account was not verified.')
        : null;
    setError(err);
  }, [router.query.error]);

  const authenticate = () => {
    setError();
    setLoading(true);
    signIn('iresucito', { email, password, callbackUrl });
  };

  const logout = () => {
    setError();
    setLoading(true);
    signOut({ callbackUrl: '/' });
  };

  const { signUp } = data;

  return (
    <div style={{ alignSelf: 'center', alignItems: 'center', flex: 0 }}>
      <Image centered circular src="cristo.png" />
      <Header textAlign="center">iResucito</Header>
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column>
          {error && <ErrorDetail error={error} simple />}
          <ApiMessage />
          {v === 1 && (
            <Message positive>{I18n.t('ui.account verified')}</Message>
          )}
          {!isLoading && !session && (
            <Form size="large">
              <Segment vertical>
                <Form.Field>
                  <Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    readOnly={loading}
                    placeholder={I18n.t('ui.email')}
                    value={email}
                    onChange={(e, { value }) => {
                      setEmail(value);
                    }}
                  />
                </Form.Field>
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  readOnly={loading}
                  placeholder={I18n.t('ui.password')}
                  type="password"
                  value={password}
                  onChange={(e, { value }) => {
                    setPassword(value);
                  }}
                />
                <Divider hidden />
                <Button
                  primary
                  size="large"
                  onClick={authenticate}
                  loading={loading}>
                  {I18n.t('ui.login')}
                </Button>
                <Button
                  basic
                  size="large"
                  onClick={() => {
                    setError();
                    signUp(email, password);
                  }}
                  disabled={loading}>
                  {I18n.t('ui.signup')}
                </Button>
              </Segment>
            </Form>
          )}
          {!isLoading && session && (
            <>
              <div style={{ fontSize: '1.2em' }}>
                <strong>Usuario:&nbsp;</strong>
                <span>{session.user}</span>
              </div>
              <Divider hidden />
              <Button negative size="large" onClick={logout} loading={loading}>
                {I18n.t('ui.logout')}
              </Button>
            </>
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default LoginForm;
