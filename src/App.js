// @flow
import React, { useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import DataContextWrapper from './DataContext';
import NavigationService from './navigation/NavigationService';
import RootNavigator from './navigation/RootNavigator';
import { Platform, Alert, Linking } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { Root, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonTheme from './native-base-theme/variables/platform';
import { MenuProvider } from 'react-native-popup-menu';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';

const mailTo = 'javier.alejandro.castro@gmail.com';
const mailSubject = 'iResucito Crash';

const sendErrorByMail = e => {
  const str = typeof e === 'string' ? e : JSON.stringify(e);
  const body = encodeURIComponent(str);
  Linking.openURL(`mailto:${mailTo}?subject=${mailSubject}&body=${body}`);
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

if (Platform.OS == 'android') {
  // Reemplazar startsWith en Android
  // por bug detallado aqui
  // https://github.com/facebook/react-native/issues/11370
  String.prototype.startsWith = function(search) {
    'use strict';
    if (this == null) {
      throw TypeError();
    }
    var string = String(this);
    var pos = arguments.length > 1 ? Number(arguments[1]) || 0 : 0;
    var start = Math.min(Math.max(pos, 0), string.length);
    return string.indexOf(String(search), pos) === start;
  };
}

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
