// @flow
import React, { useEffect } from 'react';
import { Loader } from 'semantic-ui-react';
import useLocale from 'components/useLocale';

const Index = () => {
  const locale = useLocale();

  useEffect(() => {
    locale.initialize(true);
  }, []);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Loader active inline="centered" size="large" content="Loading..." />
    </div>
  );
};

export default Index;
