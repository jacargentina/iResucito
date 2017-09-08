import React from 'react';
import { ScrollView } from 'react-native';
import { DrawerNavigator, DrawerItems } from 'react-navigation';
import HomeScreen from './screens/HomeScreen';

const App = DrawerNavigator({
   Home: {
    screen: HomeScreen
  }
}, {
  drawerWidth: 200,
  contentComponent: props => <ScrollView><DrawerItems {...props} /></ScrollView>
});

export default App;