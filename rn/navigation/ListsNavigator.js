// @flow
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import ListScreen from '../screens/ListScreen';
import ListDetail from '../screens/ListDetail';
import SongDetail from '../screens/SongDetail';
import PDFViewer from '../screens/PDFViewer';

const Stack = createStackNavigator();

const commonOptions = {
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="bookmark"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  }
};

const ListsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen
        name="Lists"
        component={ListScreen}
        options={commonOptions}
      />
      <Stack.Screen
        name="ListDetail"
        component={ListDetail}
        options={commonOptions}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetail}
        options={commonOptions}
      />
      <Stack.Screen
        name="PDFViewer"
        component={PDFViewer}
        options={commonOptions}
      />
    </Stack.Navigator>
  );
};

export default ListsNavigator;
