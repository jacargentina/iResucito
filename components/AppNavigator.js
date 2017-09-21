import React from 'react';
import { ScrollView } from 'react-native';
import { StackNavigator } from 'react-navigation';
import SalmosNavigator from './SalmosNavigator';
import { DrawerNavigator, DrawerItems } from 'react-navigation';

const AppNavigator = DrawerNavigator(
  {
    Home: {
      screen: SalmosNavigator
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
