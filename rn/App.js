// @flow
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DataContextWrapper from './DataContext';
import RootNavigator from './navigation/RootNavigator';
import SplashScreen from 'react-native-splash-screen';
import { Root, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonTheme from './native-base-theme/variables/platform';
import { MenuProvider } from 'react-native-popup-menu';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn:
    'https://645393af749a4f3da9d8074330a25da3@o469156.ingest.sentry.io/5498083',
});

const InitializeApp = () => {
  useEffect(() => {
    // Splash minimo por 1.5 segundos
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500);
  }, []);

  return null;
};

const App = () => {
  return (
    <DataContextWrapper>
      <StyleProvider style={getTheme(commonTheme)}>
        <Root>
          <MenuProvider backHandler={true}>
            <InitializeApp />
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </MenuProvider>
        </Root>
      </StyleProvider>
    </DataContextWrapper>
  );
};

export default App;
