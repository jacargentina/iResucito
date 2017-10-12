import React from 'react';
import { connect, Provider } from 'react-redux';
import { BackHandler } from 'react-native';
import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import Store from './components/store';
import AppNavigator from './components/AppNavigator';
import { INITIALIZE_DONE } from './components/actions';
import { localdata, clouddata } from './components/data';
import Indice from './Indice';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onBackPress = this.onBackPress.bind(this);
  }

  componentWillMount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    this.props.init();
    SplashScreen.hide();
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
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })}
      />
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

const basePath = Platform.OS == 'ios' ? `${RNFS.MainBundlePath}/` : '';

const preprocesar = nombre => {
  var titulo = nombre.includes('-')
    ? nombre.substring(0, nombre.indexOf('-')).trim()
    : nombre;
  var fuente =
    titulo !== nombre ? nombre.substring(nombre.indexOf('-') + 1).trim() : '';

  return {
    titulo: titulo,
    fuente: fuente,
    nombre: nombre,
    path: `${basePath}Salmos/${nombre}.content.txt`
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    init: () => {
      // Cargar la lista de salmos
      var todos = Object.keys(Indice);
      todos = todos.map(s => {
        var info = preprocesar(s);
        return Object.assign(Indice[s], info);
      });
      todos.sort(ordenAlfabetico);
      var action = {
        type: INITIALIZE_DONE,
        salmos: todos,
        settings: null,
        lists: null
      };
      /* eslint-disable no-console */
      localdata
        .getBatchData([{ key: 'settings' }, { key: 'lists' }])
        .then(result => {
          if (result[0]) {
            action.settings = result[0];
          }
          if (result[1]) {
            action.lists = result[1];
          }
          dispatch(action);
        })
        .catch(err => {
          console.log('error loading from localdata', err);
          dispatch(action);
        });
      clouddata.load({ key: 'lists' }).then(res => {
        console.log('loaded from cloud', res);
      });
    }
  };
};

const AppWithNavigationState = connect(mapStateToProps, mapDispatchToProps)(
  App
);

const Root = () => {
  return (
    <Provider store={Store}>
      <AppWithNavigationState />
    </Provider>
  );
};

export default Root;
