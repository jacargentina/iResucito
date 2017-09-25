import React from 'react';
import { StackNavigator } from 'react-navigation';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';

const SalmosNavigator = StackNavigator(
  {
    List: {
      screen: SalmoList
    },
    Detail: {
      screen: SalmoDetail
    }
  },
  {
    headerMode: 'screen',
    cardStyle: {
      backgroundColor: 'white'
    }
  }
);

export default SalmosNavigator;
