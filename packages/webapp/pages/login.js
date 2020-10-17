// @flow
import React from 'react';
import Layout from 'components/Layout';
import LoginForm from 'components/LoginForm';
import useLocale from 'components/useLocale';

const Login = () => {
  // para aplicar lenguaje
  useLocale(false);
  return (
    <Layout menu={false}>
      <LoginForm />
    </Layout>
  );
};

export default Login;
