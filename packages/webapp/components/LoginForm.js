// @flow
import React, { useState, useContext } from 'react';
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
import { signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { DataContext } from 'components/DataContext';
import ErrorDetail from 'components/ErrorDetail';
import Loading from 'components/Loading';
import I18n from '../../../translations';

const LoginForm = () => {
  const data = useContext(DataContext);
  const router = useRouter();
  const {
    query: { callbackUrl, u, v },
  } = router;
  const [email, setEmail] = useState(u || '');
  const [password, setPassword] = useState('');

  const authenticate = async () => {
    signIn('iresucito', { email, password, callbackUrl });
  };

  const error =
    router.query.error === 'CredentialsSignin'
      ? new Error('Usuario y/o contraseña inválidos')
      : undefined;

  const { signUp } = data;

  return (
    <div style={{ alignSelf: 'center', alignItems: 'center', flex: 0 }}>
      <Image centered circular src="cristo.png" />
      <Header textAlign="center">iResucito</Header>
      <Loading height="auto">
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column>
            {error && <ErrorDetail error={error} simple />}
            {v === 1 && (
              <Message positive>{I18n.t('ui.account verified')}</Message>
            )}
            <Form size="large">
              <Segment vertical>
                <Form.Field>
                  <Input
                    fluid
                    icon="user"
                    iconPosition="left"
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
                  placeholder={I18n.t('ui.password')}
                  type="password"
                  value={password}
                  onChange={(e, { value }) => {
                    setPassword(value);
                  }}
                />
                <Divider hidden />
                <Button primary size="large" onClick={authenticate}>
                  {I18n.t('ui.login')}
                </Button>
                <Button
                  basic
                  size="large"
                  onClick={() => signUp(email, password)}>
                  {I18n.t('ui.signup')}
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Loading>
    </div>
  );
};

export default LoginForm;
