import React from 'react';
import { connect, Provider } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import AppNavigator from './components/navigator';
import Store from './components/store';

const App = props => {
  return (
    <AppNavigator
      navigation={addNavigationHelpers({
        dispatch: props.dispatch,
        state: props.nav
      })}
    />
  );
};

const mapStateToProps = state => ({
  nav: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(App);

const Root = props => {
  return (
    <Provider store={Store}>
      <AppWithNavigationState />
    </Provider>
  );
};

export default Root;
