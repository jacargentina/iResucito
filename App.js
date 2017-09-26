import React from 'react';
import { connect, Provider } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import Store from './components/store';
import AppNavigator from './components/AppNavigator';
import { INITIALIZE_DONE } from './components/actions';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.init().then(() => {
      SplashScreen.hide();
    });
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

const loadRecursive = (key, path) => {
  var promise =
    Platform.OS == 'ios' ? RNFS.readDir(path) : RNFS.readDirAssets(path);
  return promise
    .then(result => {
      var loads = result.map(r => {
        if (r.isDirectory()) {
          return loadRecursive(r.name, r.path);
        }
        var separador = r.name.includes('-')
          ? r.name.indexOf('-')
          : r.name.indexOf('.');
        var extension = r.name.indexOf('.');
        var titulo = r.name.substring(0, separador).trim();
        var fuente =
          separador !== extension
            ? r.name.substring(separador + 1, extension).trim()
            : '';
        return {
          categoria: key,
          titulo: titulo,
          fuente: fuente,
          nombre: r.name,
          path: r.path
        };
      });
      return Promise.all(loads);
    })
    .then(files => {
      if (key !== 'root') {
        files = files.filter(r => r.nombre.endsWith('.pdf'));
      }
      return { [key]: files };
    });
};

const ordenAlfabetico = (a, b) => {
  if (a.titulo < b.titulo) {
    return -1;
  }
  if (a.titulo > b.titulo) {
    return 1;
  }
  return 0;
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    init: () => {
      // Cargar la lista de salmos
      var base = Platform.OS == 'ios' ? `${RNFS.MainBundlePath}/` : '';
      return loadRecursive('root', `${base}Salmos`)
        .then(items => {
          var categorias = {};
          var todos = [];
          for (var etapa in items.root) {
            var salmosCategoria = items.root[etapa];
            var nombreCategoria = Object.keys(salmosCategoria)[0];
            var salmos = salmosCategoria[nombreCategoria];
            salmos.sort(ordenAlfabetico);
            categorias = Object.assign(categorias, salmosCategoria);
            todos = todos.concat(salmos);
          }
          todos.sort(ordenAlfabetico);
          var salmos = { categorias: categorias, alfabetico: todos };
          console.log('Salmos cargados');
          dispatch({
            type: INITIALIZE_DONE,
            salmos: salmos
          });
        })
        .catch(err => {
          console.log('ERR', err);
        });
    }
  };
};

const AppWithNavigationState = connect(mapStateToProps, mapDispatchToProps)(
  App
);

const Root = props => {
  return (
    <Provider store={Store}>
      <AppWithNavigationState />
    </Provider>
  );
};

export default Root;
