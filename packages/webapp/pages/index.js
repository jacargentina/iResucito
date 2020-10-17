// @flow
import React, { useEffect } from 'react';
import { Loader } from 'semantic-ui-react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import useLocale from 'components/useLocale';

const Index = () => {
  const [session, isLoading] = useSession();
  const router = useRouter();
  const locale = useLocale(false);

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        locale.setNavigationEnabled(true);
      } else {
        router.push('/login?callbackUrl=/');
      }
    }
  }, [isLoading]);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Loader active inline="centered" size="large" />
    </div>
  );
};

export default Index;
