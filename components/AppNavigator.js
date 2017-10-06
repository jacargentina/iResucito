import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Animated, Easing } from 'react-native';
import MenuScreen from './screens/MenuScreen';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';
import SettingsScreen from './screens/SettingsScreen';

export const appNavigatorConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#8D6E63'
    },
    headerTitleStyle: {
      color: 'white'
    },
    headerBackTitleStyle: {
      color: 'white'
    },
    headerTintColor: 'white'
  },
  cardStyle: {
    backgroundColor: 'white'
  }
};

const AppNavigator = StackNavigator(
  {
    Menu: {
      screen: MenuScreen
    },
    List: {
      screen: SalmoList
    },
    Detail: {
      screen: SalmoDetail
    },
    Settings: {
      screen: SettingsScreen
    }
  },
  appNavigatorConfig
);

export default AppNavigator;
