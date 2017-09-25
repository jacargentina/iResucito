import React from 'react';
import { StackNavigator } from 'react-navigation';
import MenuScreen from './screens/MenuScreen';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';

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
    }
  },
  {
    cardStyle: {
      backgroundColor: 'white'
    }
  }
);

export default AppNavigator;
