// @flow
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DataContextWrapper from './DataContext';
import RootNavigator from './navigation/RootNavigator';
import { Alert, Linking } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Root, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonTheme from './native-base-theme/variables/platform';
import { MenuProvider } from 'react-native-popup-menu';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import DeviceInfo from 'react-native-device-info';
import queryString from 'query-string';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn:
    'https://645393af749a4f3da9d8074330a25da3@o469156.ingest.sentry.io/5498083',
});

const sendErrorByMail = async (e: any, type: string, message?: string) => {
  var body = `Sistema: ${DeviceInfo.getSystemName()}`;
  body += `\r\nVersión App: ${DeviceInfo.getReadableVersion()}`;
  body += `\r\nTipo: ${type}`;
  if (message) {
    body += `\r\nMensaje: ${message}`;
  }
  body += `\n\nDetalle: ${typeof e === 'string' ? e : JSON.stringify(e)}`;
  const query = queryString.stringify({
    subject: 'iResucito Crash',
    body: body,
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
    const detail = e.name && e.message ? `${e.name} ${e.message}` : '';
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
            sendErrorByMail(e, 'javascript', detail);
          },
        },
      ]
    );
  }
}

setJSExceptionHandler(errorHandler);
setNativeExceptionHandler((nativeError) => {
  sendErrorByMail(nativeError, 'native');
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
