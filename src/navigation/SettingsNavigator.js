// @flow
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import SettingsScreen from '../screens/SettingsScreen';
import withI18nTitle from './withI18nTitle';

const SettingsNavigator = createStackNavigator(
  {
    Settings: withI18nTitle(SettingsScreen, 'screen_title.settings')
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
