// @flow
import React, { useState, useContext } from 'react';
import {
  Header,
  Segment,
  Button,
  Grid,
  Form,
  Container,
  Divider,
  Input
} from 'semantic-ui-react';
import { DataContext } from './DataContext';
import ApiMessage from './ApiMessage';

const Login = () => {
  const data = useContext(DataContext);
  const { login, signUp } = data;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ flex: 0 }}>
      <Header textAlign="center">iResucito Login</Header>
      <Container text>
        <ApiMessage />
        <Grid textAlign="center" verticalAlign="middle">
          <Grid.Column>
            <Form size="large">
              <Segment vertical>
                <Form.Field>
                  <Input
                    fluid
                    icon="user"
                    iconPosition="left"
                    placeholder="Dirección de e-mail"
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
                  placeholder="Contraseña"
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
                  Ingresar
                </Button>
                <Button
                  basic
                  size="large"
                  onClick={() => signUp(email, password)}>
                  Registrarme
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    </div>
  );
};

export default Login;
