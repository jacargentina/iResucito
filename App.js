import React from 'react';
import { connect, Provider } from 'react-redux';
import { BackHandler, Platform, Alert } from 'react-native';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import RNFS from 'react-native-fs';
import SplashScreen from 'react-native-splash-screen';
import { Root, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import commonTheme from './native-base-theme/variables/platform';
import Store from './components/store';
import AppNavigator from './components/AppNavigator';
import { INITIALIZE_DONE } from './components/actions';
import { localdata, clouddata } from './components/data';
import { esLineaDeNotas } from './components/util';
import Indice from './Indice.json';
import { MenuContext } from 'react-native-popup-menu';

import I18n from './i18n';
const locale = I18n.currentLocale().split('-')[0];

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

const ordenAlfabetico = (a, b) => {
  if (a.titulo < b.titulo) {
    return -1;
  }
  if (a.titulo > b.titulo) {
    return 1;
  }
  return 0;
};

const salmosBasePath = () => {
  var basePath = Platform.OS == 'ios' ? `${RNFS.MainBundlePath}/` : '';

  var pathForLocale = `${basePath}Salmos/${locale}`;
  return RNFS.stat(pathForLocale)
    .then(() => {
      return pathForLocale;
    })
    .catch(() => {
      //console.log('stat err:', err);
      return `${basePath}Salmos/es`;
    });
};

const preprocesar = (rootPath, nombre) => {
  var titulo = nombre.includes('-')
    ? nombre.substring(0, nombre.indexOf('-')).trim()
    : nombre;
  var fuente =
    titulo !== nombre ? nombre.substring(nombre.indexOf('-') + 1).trim() : '';

  return {
    titulo: titulo,
    fuente: fuente,
    nombre: nombre,
    path: `${rootPath}/${nombre}.content.txt`,
    fullText: null,
    lines: null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    init: () => {
      // Cargar la lista de salmos
      return salmosBasePath().then(basePath => {
        var cantos = Object.keys(Indice);
        cantos = cantos.map(key => {
          var nombre = Indice[key].files.hasOwnProperty(locale)
            ? Indice[key].files[locale]
            : Indice[key].files['es'];
          var info = preprocesar(basePath, nombre);
          return Object.assign(Indice[key], info);
        });
        cantos.sort(ordenAlfabetico);
        var action = {
          type: INITIALIZE_DONE,
          salmos: cantos,
          settings: null,
          lists: null,
          contacts: []
        };
        var promises = [];
        cantos.forEach(salmo => {
          var loadSalmo =
            Platform.OS == 'ios'
              ? RNFS.readFile(salmo.path)
              : RNFS.readFileAssets(salmo.path);
          loadSalmo
            .then(content => {
              // Separar en lineas, y quitar todas hasta llegar a las notas
              var lineas = content.split('\n');
              while (!esLineaDeNotas(lineas[0])) {
                lineas.shift();
              }
              salmo.lines = lineas;
              salmo.fullText = lineas.join(' ');
            })
            .catch(err => {
              /* eslint-disable no-console */
              Alert.alert('Error', err.message);
            });
          promises.push(loadSalmo);
        });
        promises.push(
          localdata
            .getBatchData([
              { key: 'settings' },
              { key: 'lists' },
              { key: 'contacts' }
            ])
            .then(result => {
              [action.settings, action.lists, action.contacts] = result;
              dispatch(action);
            })
            .catch(err => {
              /* eslint-disable no-console */
              console.log('error loading from localdata', err);
              dispatch(action);
            })
        );
        promises.push(
          clouddata.load({ key: 'lists' }).then(res => {
            /* eslint-disable no-console */
            console.log('loaded from cloud', res);
          })
        );
        return Promise.all(promises);
      });
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
