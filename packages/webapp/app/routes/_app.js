import React from 'react';
import { Provider, getSession } from 'next-auth/client';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

const WebsiteApp = ({ Component, pageProps }) => {
  const { session } = pageProps;
  return (
    <Provider session={session}>
      <Component {...pageProps} />
    </Provider>
  );
};

WebsiteApp.getServerSideProps = async (context) => {
  return {
    props: {
      session: await getSession(context),
    },
  };
};

export default WebsiteApp;
