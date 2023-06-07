import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SongChooserDialog, SongPreviewScreenDialog } from '../screens';
import { useStackNavOptions } from './index';

export type ChooserParamList = {
  Dialog: { target: { listName: string; listKey: string | number } };
  ViewSong: {
    data: { text: string; title: string; source: string; stage: string };
  };
};

const Stack = createStackNavigator<ChooserParamList>();

export const SongChooserNavigator = () => {
  const options = useStackNavOptions();
  return (
    <Stack.Navigator
      screenOptions={{ ...options, headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="Dialog" component={SongChooserDialog} />
      <Stack.Screen name="ViewSong" component={SongPreviewScreenDialog} />
    </Stack.Navigator>
  );
};
