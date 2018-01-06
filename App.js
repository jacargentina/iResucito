import React from 'react';
import { connect, Provider } from 'react-redux';
import { BackHandler, Platform } from 'react-native';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import SplashScreen from 'react-native-splash-screen';
import { Root, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonTheme from './native-base-theme/variables/platform';
import Store from './components/store';
import AppNavigator from './components/AppNavigator';
import { MenuContext } from 'react-native-popup-menu';
import { localdata, clouddata } from './components/data';
import { initializeSetup, initializeLocale } from './components/actions';

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
  }

  componentWillMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    this.props.init().then(() => {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2500);
    });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
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
    return (
      <StyleProvider style={getTheme(commonTheme)}>
        <Root>
          <MenuContext backHandler={true}>
            <AppNavigator
              navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav
              })}
            />
          </MenuContext>
        </Root>
      </StyleProvider>
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav
});

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    init: () => {
      /* eslint-disable no-console */
      var promises = [];
      // Cargar configuracion
      promises.push(
        localdata
          .getBatchData([
            { key: 'settings' },
            { key: 'lists' },
            { key: 'contacts' }
          ])
          .then(result => {
            var [settings, lists, contacts] = result;
            dispatch(initializeSetup(settings, lists, contacts));
          })
          .catch(err => {
            console.log('error loading from localdata', err);
          })
          .finally(() => {
            dispatch(initializeLocale());
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
