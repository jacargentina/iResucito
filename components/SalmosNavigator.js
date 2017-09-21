import React from 'react';
import { StackNavigator } from 'react-navigation';
import SalmosScreen from './screens/SalmosScreen';
import SalmoScreen from './screens/SalmoScreen';

const SalmosNavigator = StackNavigator(
  {
    Salmos: {
      screen: SalmosScreen
    },
    Salmo: {
      screen: SalmoScreen
    }
  },
  {
    headerMode: 'none',
    cardStyle: {
      backgroundColor: 'white'
    }
  }
);

export default SalmosNavigator;
