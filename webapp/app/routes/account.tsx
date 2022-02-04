import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
  useSearchParams,
  useSubmit,
  useTransition,
} from 'remix';
import { authenticator } from '~/auth.server';
import Layout from '~/components/Layout';
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
import * as axios from 'axios';
import ErrorDetail from '~/components/ErrorDetail';
import ApiMessage from '~/components/ApiMessage';
import { useApp } from '~/app.context';
import { getSession } from '~/session.server';
import I18n from '~/translations';

export let action: ActionFunction = async ({ request }) => {
  // clonar: evitar consumir el body
  // para la llamada a authenticator
  const r = request.clone();
  const body = await r.formData();
  const afterLoginGoTo = (body.get('callbackUrl') as string) ?? '/';
  return await authenticator.authenticate('lowdb', request, {
    successRedirect: afterLoginGoTo,
    failureRedirect: '/account',
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  let authData = await authenticator.isAuthenticated(request);
  if (authData) {
    return redirect('/');
  }
  const session = await getSession(request.headers.get('Cookie'));
  return {
    error: session.get('auth:error'),
  };
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
  const { setApiResult, setApiLoading, handleApiError } = app;
  const [email, setEmail] = useState(searchParams.get('u') || '');
  const [password, setPassword] = useState('');
  const [changePassVisible, setChangePassVisible] = useState(false);
  const [changePassEnabled, setChangePassEnabled] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const authenticate = () => {
    submit({ email, password }, { method: 'post' });
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
      .post('/signup', {
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
      .post('/changepassword', {
        newPassword,
      })
      .then((response) => {
        setApiResult(response.data);
        setApiLoading(false);
        if (response.data && response.data.ok === 'PasswordChanged') {
          submit(
            { callbackUrl: '/account' },
            { action: '/logout', method: 'post' }
          );
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
                </Segment>
              </Form>
            )}
            {app.user && (
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
                  <span>{app.user}</span>
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
    </Layout>
  );
};

export default Account;
