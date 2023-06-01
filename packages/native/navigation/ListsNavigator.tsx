import * as React from 'react';
import { HStack } from '../gluestack';
import { createStackNavigator } from '@react-navigation/stack';
import i18n from '@iresucito/translations';
import { PDFViewer, ListScreen, ListDetail, SongDetail } from '../screens';
import { ShareListButton, AddSongButton } from '../components';
import { getSongDetailOptions, getPdfViewerOptions } from './util';
import { useStackNavOptions } from './useStackNavOptions';
import { Song } from '@iresucito/core';
import { useSettingsStore } from '../hooks';

export type ListsStackParamList = {
  ListsSearch: undefined;
  ListDetail: { listName: string };
  SongDetail: { song: Song };
  PDFViewer: { uri: string; title: string };
};

const Stack = createStackNavigator<ListsStackParamList>();

const ListsNavigator = () => {
  const options = useStackNavOptions();
  const { computedLocale } = useSettingsStore();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="ListsSearch"
        component={ListScreen}
        options={() => {
          return {
            title: i18n.t('screen_title.lists', {
              locale: computedLocale,
            }),
          };
        }}
      />
      <Stack.Screen
        name="ListDetail"
        component={ListDetail}
        options={({ route }) => {
          const { listName } = route.params;
          return {
            title: listName ? listName : 'Lista',
            headerRight: () => (
              <HStack m="$1">
                <ShareListButton />
                <AddSongButton />
              </HStack>
            ),
          };
        }}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetail}
        options={({ route }) => getSongDetailOptions(route.params.song)}
      />
      <Stack.Screen
        name="PDFViewer"
        component={PDFViewer}
        options={({ route }) => getPdfViewerOptions(route.params.title)}
      />
    </Stack.Navigator>
  );
};

export default ListsNavigator;
