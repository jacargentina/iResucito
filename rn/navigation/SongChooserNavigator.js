// @flow
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import SongChooserDialog from '../screens/SongChooserDialog';
import SongPreviewScreenDialog from '../screens/SongPreviewScreenDialog';

const Stack = createStackNavigator();

const SongChooserNavigator = (props: any) => {
  return (
    <Stack.Navigator
      mode="modal"
      headerMode="none"
      screenOptions={StackNavigatorOptions()}>
      <Stack.Screen name="Dialog" component={SongChooserDialog} />
      <Stack.Screen name="ViewSong" component={SongPreviewScreenDialog} />
    </Stack.Navigator>
  );
};

export default SongChooserNavigator;
