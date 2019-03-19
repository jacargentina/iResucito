// @flow
import React, { useContext, useState, useEffect } from 'react';
import { createAppContainer } from 'react-navigation';
import DataContextWrapper, { DataContext } from './DataContext';
import MenuNavigator from './MenuNavigator';
import { Platform, Alert, Linking } from 'react-native';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import SplashScreen from 'react-native-splash-screen';
import { Root, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonTheme from './native-base-theme/variables/platform';
import { MenuProvider } from 'react-native-popup-menu';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler
} from 'react-native-exception-handler';
import { localdata, clouddata } from './data';
import ListAddDialog from './screens/ListAddDialog';
import ContactChooserDialog from './screens/ContactChooserDialog';
import SalmoChooserDialog from './screens/SalmoChooserDialog';
import SalmoChooseLocaleDialog from './screens/SalmoChooseLocaleDialog';
import ContactImportDialog from './screens/ContactImportDialog';
import { getContacts } from './util';

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

const AppContainerWithInit = () => {
  const [initialized, setInitialized] = useState(false);
  const [lastThumbsCacheDir, setLastThumbsCacheDir] = useState();
  const data = useContext(DataContext);

  const { initializeLocale } = data;
  const { initLists } = data.lists;
  const { keys, initKeys } = data.settings;
  const { brothers, initBrothers, update, save } = data.community;

  useEffect(() => {
    if (lastThumbsCacheDir && brothers) {
      // sólo actualizar si cambió el directorio de caches
      if (lastThumbsCacheDir !== RNFS.CachesDirectoryPath) {
        getContacts().then(currentContacts => {
          brothers.forEach(c => {
            // tomar los datos actualizados
            var currContact = currentContacts.find(
              x => x.recordID === c.recordID
            );
            update(c.recordID, currContact);
          });
          // guardar directorio nuevo
          var item = {
            key: 'lastCachesDirectoryPath',
            data: RNFS.CachesDirectoryPath
          };
          localdata.save(item);
          // guardar contactos refrescados
          save();
        });
      }
    }
  }, [lastThumbsCacheDir, brothers]);

  const initializeApp = () => {
    var promises = [];
    // Cargar configuracion
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
          var loadedContacts = contacts || [];
          var loadedLists = lists || [];
          if (settings) {
            initKeys(settings);
          }
          initBrothers(loadedContacts);
          initLists(loadedLists);
          // Forzar la actualizacion si estamos emulando
          if (DeviceInfo.isEmulator()) {
            lastCachesDirectoryPath = null;
          }
          setLastThumbsCacheDir(lastCachesDirectoryPath);
        })
        .catch(err => {
          console.log('error loading from localdata', err);
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

  useEffect(() => {
    if (initialized && keys) {
      var locale = (keys && keys.locale) || 'default';
      // Configurar dependiendo del lenguaje
      initializeLocale(locale);
    }
  }, [keys, initialized]);

  const AppContainer = createAppContainer(MenuNavigator);

  return (
    <AppContainer
      ref={navigation => {
        MenuNavigator.rootNavigation = navigation;
      }}
    />
  );
};

const App = () => {
  return (
    <DataContextWrapper>
      <StyleProvider style={getTheme(commonTheme)}>
        <Root>
          <MenuProvider backHandler={true}>
            <SalmoChooserDialog />
            <SalmoChooseLocaleDialog />
            <ContactChooserDialog />
            <ContactImportDialog />
            <ListAddDialog />
            <AppContainerWithInit />
          </MenuProvider>
        </Root>
      </StyleProvider>
    </DataContextWrapper>
  );
};

export default App;
