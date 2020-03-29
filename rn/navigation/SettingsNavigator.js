// @flow
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import SettingsScreen from '../screens/SettingsScreen';
import I18n from '../../translations';

const Stack = createStackNavigator();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation, route }) => {
          return { title: I18n.t('screen_title.settings') };
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
