// @flow
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import SettingsScreen from '../screens/SettingsScreen';

const SettingsNavigator = createStackNavigator(
  {
    Settings: SettingsScreen
  },
  {
    defaultNavigationOptions: StackNavigatorOptions
  }
);

SettingsNavigator.navigationOptions = () => ({
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="settings"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  }
});

export default SettingsNavigator;
