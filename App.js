import React from 'react';
import { connect, Provider } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import RNFS from 'react-native-fs';

import Store from './components/store';
import AppNavigator from './components/navigator';
import { INITIALIZE_DONE } from './components/actions';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.init();
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
  return RNFS.readDir(path)
    .then(result => {
      var loads = result.map(r => {
        if (r.isDirectory()) {
          return loadRecursive(r.name, r.path);
        }
        return r.path;
      });
      return Promise.all(loads);
    })
    .then(files => {
      return { [key]: files };
    });
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    init: () => {
      // Cargar la lista de salmos
      // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      var salmosPath = RNFS.MainBundlePath + '/Salmos';
      loadRecursive('root', salmosPath)
        .then(items => {
          console.log('items', items);
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
