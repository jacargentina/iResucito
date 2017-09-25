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
    cardStyle: {
      backgroundColor: 'white'
    }
  }
);

export default SalmosNavigator;
