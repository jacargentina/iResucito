// @flow
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import SongSearch from '../screens/SongSearch';
import SongList from '../screens/SongList';
import SongDetail from '../screens/SongDetail';
import UnassignedList from '../screens/UnassignedList';
import PDFViewer from '../screens/PDFViewer';

const Stack = createStackNavigator();

const commonOptions = {
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="search"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  }
};

const SongsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen
        name="SongSearch"
        component={SongSearch}
        options={commonOptions}
      />
      <Stack.Screen
        name="SongList"
        component={SongList}
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
      <Stack.Screen
        name="UnassignedList"
        component={UnassignedList}
        options={commonOptions}
      />
    </Stack.Navigator>
  );
};

export default SongsNavigator;
