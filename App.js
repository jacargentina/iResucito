// @flow
import React, { useContext, useState, useEffect } from 'react';
import DataContextWrapper, { DataContext } from './DataContext';
import { BackHandler, Platform, Alert, Linking } from 'react-native';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import { Root, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonTheme from './native-base-theme/variables/platform';
import AppNavigator from './components/AppNavigator';
import { MenuProvider } from 'react-native-popup-menu';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import { localdata, clouddata } from './components/data';
import { NativeSongs, getDefaultLocale } from './components/util';
import I18n from './components/translations';
import badges from './components/badges';

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

const AppContent = () => {
  const [initialized, setInitialized] = useState(false);
  const data = useContext(DataContext);

  const { initLists } = data.lists;
  const { initKeys } = data.settings;
  const { refreshThumbs, initBrothers } = data.community;

  const initializeApp = () => {
    var promises = [];
    // Cargar configuracion
    var locale = 'default';
    promises.push(
      localdata
        .getBatchData([
          { key: 'settings' },
          { key: 'lists' },
          { key: 'contacts' },
          { key: 'lastCachesDirectoryPath' }
        ])
        .then(result => {
          var [settings, lists, contacts, lastCachesDirectoryPath] = result;
          locale = (settings && settings.locale) || 'default';
          initKeys(settings);
          initBrothers(contacts || []);
          initLists(lists || []);
          // Forzar la actualizacion si estamos emulando
          if (DeviceInfo.isEmulator()) {
            lastCachesDirectoryPath = null;
          }
          return refreshThumbs(
            lastCachesDirectoryPath,
            RNFS.CachesDirectoryPath
          );
        })
        .catch(err => {
          console.log('error loading from localdata', err);
        })
        .finally(() => {
          data.initializeLocale(locale);
        })
    );
    // Cargar listas desde iCloud
    promises.push(
      clouddata.load({ key: 'lists' }).then(res => {
        console.log('loaded from iCloud', res);
      })
    );
    // Indicar finalizacion de inicializacion
    Promise.all(promises).then(() => {
      setInitialized(true);
    });
  };

  useEffect(() => {
    // Splash minimo por 1.5 segundos
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500);
    // Arrancar app
    initializeApp();
  }, []);

  return (
    <StyleProvider style={getTheme(commonTheme)}>
      <Root>
        <MenuProvider backHandler={true}>
          <AppNavigator />
        </MenuProvider>
      </Root>
    </StyleProvider>
  );
};

const App = () => {
  return (
    <DataContextWrapper>
      <AppContent />
    </DataContextWrapper>
  );
};

export default App;
