import React from 'react';
import { ScrollView } from 'react-native';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import { Provider } from 'react-redux';
import store from './components/store';

import HomeScreen from './components/screens/HomeScreen';

const AppWihDrawer = DrawerNavigator(
  {
    Home: {
      screen: HomeScreen
    }
  },
  {
    drawerWidth: 200,
    contentComponent: props => (
      <ScrollView>
        <DrawerItems {...props} />
      </ScrollView>
    )
  }
);

class Root extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppWihDrawer />
      </Provider>
    );
  }
}

export default Root;
