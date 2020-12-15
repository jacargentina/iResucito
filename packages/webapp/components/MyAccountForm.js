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
  Modal,
} from 'semantic-ui-react';
import * as axios from 'axios';
import { useSession, signIn, signOut } from 'next-auth/client';
import { useRouter } from 'next/router';
import { DataContext } from 'components/DataContext';
import ErrorDetail from 'components/ErrorDetail';
import ApiMessage from 'components/ApiMessage';
import I18n from '../../../translations';

const MyAccountForm = () => {
  const [session, isLoading] = useSession();
  const data = useContext(DataContext);
  const { setApiResult, setApiLoading, handleApiError } = data;
  const router = useRouter();
  const {
    query: { callbackUrl, u, v },
  } = router;
  const [email, setEmail] = useState(u || '');
  const [password, setPassword] = useState('');
  const [changePassVisible, setChangePassVisible] = useState(false);
  const [changePassEnabled, setChangePassEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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
    signIn('iresucito', {
      email,
      password,
      callbackUrl: callbackUrl || '/list',
    });
  };

  const signUp = () => {
    if (email.indexOf('@') === -1) {
      handleApiError(
        new Error(
          'E-mail address has an invalid format. Please correct its value.'
        )
      );
      return;
    }
    setApiResult();
    setApiLoading(true);
    return axios
      .post('/api/signup', {
        email,
        password,
      })
      .then((response) => {
        setApiResult(response.data);
        setApiLoading(false);
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  const changePassword = () => {
    setApiResult();
    setApiLoading(true);
    return axios
      .post('/api/changepassword', {
        newPassword,
      })
      .then((response) => {
        setApiResult(response.data);
        setApiLoading(false);
        if (response.data && response.data.ok === 'PasswordChanged') {
          signOut({ callbackUrl: '/account' });
        }
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  useEffect(() => {
    setChangePassEnabled(
      newPassword !== '' &&
        confirmNewPassword !== '' &&
        newPassword === confirmNewPassword
    );
  }, [newPassword, confirmNewPassword]);

  return (
    <div style={{ padding: 30, width: 500, margin: 'auto' }}>
      <Image centered circular src="cristo.png" />
      <Header textAlign="center">iResucito</Header>
      <Grid textAlign="center" verticalAlign="middle">
        <Grid.Column>
          {error && <ErrorDetail error={error} simple />}
          <ApiMessage />
          {v && <Message positive>{I18n.t('ui.account verified')}</Message>}
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
                    autoComplete="username"
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
                  autoComplete="current-password"
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
                    signUp();
                  }}
                  disabled={loading}>
                  {I18n.t('ui.signup')}
                </Button>
              </Segment>
            </Form>
          )}
          {!isLoading && session && (
            <>
              {changePassVisible && (
                <Modal
                  centered={false}
                  open={changePassVisible}
                  onClose={() => setChangePassVisible(false)}
                  size="small">
                  <Modal.Header>{I18n.t('ui.change password')}</Modal.Header>
                  <Modal.Content>
                    <h5>{I18n.t('ui.new password')}</h5>
                    <Input
                      fluid
                      autoFocus
                      value={newPassword}
                      onChange={(e, { value }) => {
                        setNewPassword(value);
                      }}
                      type="password"
                    />
                    <h5>{I18n.t('ui.confirm new password')}</h5>
                    <Input
                      fluid
                      value={confirmNewPassword}
                      onChange={(e, { value }) => {
                        setConfirmNewPassword(value);
                      }}
                      type="password"
                    />
                  </Modal.Content>
                  <Modal.Actions>
                    <Button
                      primary
                      disabled={!changePassEnabled}
                      onClick={() => {
                        changePassword();
                      }}>
                      {I18n.t('ui.apply')}
                    </Button>
                    <Button
                      negative
                      onClick={() => setChangePassVisible(false)}>
                      {I18n.t('ui.cancel')}
                    </Button>
                  </Modal.Actions>
                </Modal>
              )}
              <div style={{ fontSize: '1.2em' }}>
                <strong>Usuario:&nbsp;</strong>
                <span>{session.user}</span>
              </div>
              <Divider hidden />
              <Button size="large" onClick={() => setChangePassVisible(true)}>
                {I18n.t('ui.change password')}
              </Button>
            </>
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default MyAccountForm;
