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

const Login = () => {
  const data = useContext(DataContext);
  const { authenticate } = data;
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  return (
    <div style={{ padding: 10 }}>
      <Header textAlign="center">Ingresar a mi Cuenta</Header>
      <Container>
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
                <Button primary size="large" onClick={authenticate}>
                  Ingresar
                </Button>
                <Button basic size="large">
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
