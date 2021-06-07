// @flow
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import DataContextWrapper from './DataContext';
import RootNavigator from './navigation/RootNavigator';
import { Root, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonTheme from './native-base-theme/variables/platform';
import { MenuProvider } from 'react-native-popup-menu';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://645393af749a4f3da9d8074330a25da3@o469156.ingest.sentry.io/5498083',
});

const App = () => {
  return (
    <DataContextWrapper>
      <StyleProvider style={getTheme(commonTheme)}>
        <Root>
          <MenuProvider backHandler={true}>
            <NavigationContainer
              onReady={() => {
                /* Para evitar efecto de 'salto' en layout de android
                 * y efecto 'aplicar idioma' en ambas plataformas
                 * esperar un segundo y medio antes de ocultar */
                setTimeout(() => {
                  RNBootSplash.hide({ fade: true });
                }, 1500);
              }}>
              <RootNavigator />
            </NavigationContainer>
          </MenuProvider>
        </Root>
      </StyleProvider>
    </DataContextWrapper>
  );
};

export default App;
