// @flow
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
