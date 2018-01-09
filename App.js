import React from 'react';
import { connect, Provider } from 'react-redux';
import { BackHandler, Platform, View, Text } from 'react-native';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import { Root, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonTheme from './native-base-theme/variables/platform';
import Store from './components/store';
import AppNavigator from './components/AppNavigator';
import { MenuProvider } from 'react-native-popup-menu';
import { localdata, clouddata } from './components/data';
import {
  initializeSetup,
  initializeLocale,
  refreshContactsThumbs
} from './components/actions';

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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onBackPress = this.onBackPress.bind(this);
    this.state = {
      initialized: false
    };
  }

  componentWillMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    this.props.init().then(() => {
      setTimeout(() => {
        SplashScreen.hide();
        this.setState({ initialized: true });
      }, 2500);
    });
  }

  onBackPress() {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    dispatch(NavigationActions.back());
    return true;
  }

  render() {
    if (!this.state.initialized) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <Text>Inicializando...</Text>
        </View>
      );
    }
    return (
      <StyleProvider style={getTheme(commonTheme)}>
        <Root>
          <MenuProvider backHandler={true}>
            <AppNavigator
              navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav
              })}
            />
          </MenuProvider>
        </Root>
      </StyleProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    nav: state.nav
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    init: () => {
      /* eslint-disable no-console */
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
            locale = settings.locale;
            dispatch(initializeSetup(settings, lists, contacts));
            // Forzar la actualizacion si estamos emulando
            if (DeviceInfo.isEmulator()) {
              lastCachesDirectoryPath = null;
            }
            dispatch(
              refreshContactsThumbs(
                lastCachesDirectoryPath,
                RNFS.CachesDirectoryPath
              )
            );
          })
          .catch(err => {
            console.log('error loading from localdata', err);
          })
          .finally(() => {
            dispatch(initializeLocale(locale));
          })
      );
      // Cargar listas desde iCloud
      promises.push(
        clouddata.load({ key: 'lists' }).then(res => {
          console.log('loaded from iCloud', res);
        })
      );
      return Promise.all(promises);
    }
  };
};

const AppWithNavigationState = connect(mapStateToProps, mapDispatchToProps)(
  App
);

const AppWithReduxStore = () => {
  return (
    <Provider store={Store}>
      <AppWithNavigationState />
    </Provider>
  );
};

export default AppWithReduxStore;
