import React from 'react';
import { ScrollView } from 'react-native';
import { DrawerNavigator, DrawerItems } from 'react-navigation';

import SalmosScreen from './screens/SalmosScreen';

const AppNavigator = DrawerNavigator(
  {
    Salmos: {
      screen: SalmosScreen
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