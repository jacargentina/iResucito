// @flow
import * as React from 'react';
import DataContextWrapper from 'components/DataContext';
import Layout from 'components/Layout';
import MyAccountForm from 'components/MyAccountForm';
import useLocale from 'components/useLocale';
import I18n from '../../../translations';

const Login = (): React.Node => {
  // para aplicar lenguaje
  useLocale();
  return (
    <DataContextWrapper>
      <Layout title={I18n.t('ui.login')}>
        <MyAccountForm />
      </Layout>
    </DataContextWrapper>
  );
};

export default Login;
