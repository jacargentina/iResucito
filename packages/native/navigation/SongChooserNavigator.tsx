import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SongChooserDialog from '../screens/SongChooserDialog';
import SongPreviewScreenDialog from '../screens/SongPreviewScreenDialog';
import { useStackNavOptions } from './util';

export type ChooserParamList = {
  Dialog: { target: { listName: string; listKey: string } };
  ViewSong: {
    data: { text: string; title: string; source: string; stage: string };
  };
};

const Stack = createStackNavigator<ChooserParamList>();

const SongChooserNavigator = () => {
  const options = useStackNavOptions();
  return (
    <Stack.Navigator
      screenOptions={{ ...options, headerShown: false, presentation: 'modal' }}
    >
      <Stack.Screen name="Dialog" component={SongChooserDialog} />
      <Stack.Screen name="ViewSong" component={SongPreviewScreenDialog} />
    </Stack.Navigator>
  );
};

export default SongChooserNavigator;
