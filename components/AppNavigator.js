import React from 'react';
import { ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import SalmosNavigator from './SalmosNavigator';
import { DrawerNavigator, DrawerItems } from 'react-navigation';

const AppNavigator = DrawerNavigator(
  {
    Alfabetico: {
      screen: SalmosNavigator,
      navigationOptions: {
        title: 'Alfabetico'
      }
    },
    Precatecumenado: {
      screen: SalmosNavigator,
      navigationOptions: {
        title: 'Precatecumenado'
      }
    },
    Catecumenado: {
      screen: SalmosNavigator,
      navigationOptions: {
        title: 'Catecumenado'
      }
    },
    Eleccion: {
      screen: SalmosNavigator,
      navigationOptions: {
        title: 'Eleccion'
      }
    },
    Liturgia: {
      screen: SalmosNavigator,
      navigationOptions: {
        title: 'Liturgia'
      }
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

export default AppNavigator;
