// @flow
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import CommunityScreen from '../screens/CommunityScreen';

const Stack = createStackNavigator();

const CommunityNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen name="Community" component={CommunityScreen} />
    </Stack.Navigator>
  );
};

export default CommunityNavigator;
