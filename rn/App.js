// @flow
import React, { useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import DataContextWrapper from './DataContext';
import NavigationService from './navigation/NavigationService';
import RootNavigator from './navigation/RootNavigator';
import { Alert, Linking } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Root, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonTheme from './native-base-theme/variables/platform';
import { MenuProvider } from 'react-native-popup-menu';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import DeviceInfo from 'react-native-device-info';
import queryString from 'query-string';

const sendErrorByMail = async e => {
  const str = typeof e === 'string' ? e : JSON.stringify(e);
  const systemName = DeviceInfo.getSystemName();
  const version = DeviceInfo.getReadableVersion();
  const query = queryString.stringify({
    subject: 'iResucito Crash',
    body: `System ${systemName}, Version ${version}\n\n${str}`
  });
  let url = 'mailto:javier.alejandro.castro@gmail.com';
  if (query.length) {
    url += `?${query}`;
  }
  Linking.openURL(url);
};

function errorHandler(e, isFatal) {
  console.log('errorHandler', e);
  if (isFatal) {
    const detail = e.name && e.message ? `${e.name} ${e.message}` : e;
    Alert.alert(
      'Unexpected error occurred',
      `
        Error: ${isFatal ? 'Fatal:' : ''} ${detail}

        Press OK to send an email with details to the developer
        `,
      [
        {
          text: 'OK',
          onPress: () => {
            sendErrorByMail(e);
          }
        }
      ]
    );
  }
}

setJSExceptionHandler(errorHandler);
setNativeExceptionHandler(nativeError => {
  sendErrorByMail(nativeError);
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
  const AppContainer = createAppContainer(RootNavigator);

  return (
    <DataContextWrapper>
      <StyleProvider style={getTheme(commonTheme)}>
        <Root>
          <MenuProvider backHandler={true}>
            <InitializeApp />
            <AppContainer
              ref={navigation => {
                NavigationService.setTopLevelNavigator(navigation);
              }}
            />
          </MenuProvider>
        </Root>
      </StyleProvider>
    </DataContextWrapper>
  );
};

export default App;
