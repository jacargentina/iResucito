// @flow
import React, { useState, useContext } from 'react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Divider from 'semantic-ui-react/dist/commonjs/elements/Divider';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Image from 'semantic-ui-react/dist/commonjs/elements/Image';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import { DataContext } from './DataContext';
import I18n from '../../src/translations';
import ApiMessage from './ApiMessage';
import Loading from './Loading';
import queryString from 'query-string';

const Login = () => {
  const parsed = queryString.parse(location.search);
  const data = useContext(DataContext);
  const { login, signUp } = data;
  const [email, setEmail] = useState(parsed.u || '');
  const [password, setPassword] = useState('');

  return (
    <div>
      <Image
        centered
        circular
        src="cristo.png"
        style={{ marginTop: '100px' }}
      />
      <Header textAlign="center">iResucito</Header>
      <Loading height="auto">
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column>
            <ApiMessage />
            {parsed.v === 1 && (
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
                <Button
                  primary
                  size="large"
                  onClick={() => login(email, password)}>
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

export default Login;
