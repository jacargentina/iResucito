// @flow
import React from 'react';
import DataContextWrapper from 'components/DataContext';
import Layout from 'components/Layout';
import LoginForm from 'components/LoginForm';
import useLocale from 'components/useLocale';
import I18n from '../../../translations';

const Login = () => {
  // para aplicar lenguaje
  useLocale();
  return (
    <DataContextWrapper>
      <Layout menu={false} title={I18n.t('ui.login')}>
        <LoginForm />
      </Layout>
    </DataContextWrapper>
  );
};

export default Login;
