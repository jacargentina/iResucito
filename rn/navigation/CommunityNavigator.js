// @flow
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import CommunityScreen from '../screens/CommunityScreen';

const Stack = createStackNavigator();

const CommunityNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen
        name="Community"
        component={CommunityScreen}
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

export default CommunityNavigator;
