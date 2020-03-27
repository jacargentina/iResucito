// @flow
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const SettingsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused, tintColor }) => {
            return (
              <Icon
                name="contacts"
                active={focused}
                style={{ marginTop: 6, color: tintColor }}
              />
            );
          }
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
