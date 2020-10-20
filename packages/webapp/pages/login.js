// @flow
import React from 'react';
import DataContextWrapper from 'components/DataContext';
import Layout from 'components/Layout';
import LoginForm from 'components/LoginForm';
import useLocale from 'components/useLocale';

const Login = () => {
  // para aplicar lenguaje
  useLocale();
  return (
    <DataContextWrapper>
      <Layout menu={false}>
        <LoginForm />
      </Layout>
    </DataContextWrapper>
  );
};

export default Login;
