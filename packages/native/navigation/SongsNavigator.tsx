import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SongSearch from '../screens/SongSearch';
import SongList from '../screens/SongList';
import SongDetail from '../screens/SongDetail';
import PDFViewer from '../screens/PDFViewer';
import i18n from '@iresucito/translations';
import { useData } from '../DataContext';
import { getSongDetailOptions, getPdfViewerOptions } from './util';
import useStackNavOptions from './StackNavOptions';
import { Song } from '@iresucito/core';

export type SongsStackParamList = {
  SongSearch: undefined;
  SongList: { title_key: string; filter?: any; sort?: Function };
  SongDetail: { song: Song };
  PDFViewer: { uri: string; title: string };
};

const Stack = createStackNavigator<SongsStackParamList>();

const SongsNavigator = () => {
  const data = useData();
  const options = useStackNavOptions();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="SongSearch"
        component={SongSearch}
        options={{
          title: i18n.t('screen_title.search', { locale: data.localeReal }),
        }}
      />
      <Stack.Screen
        name="SongList"
        component={SongList}
        options={({ route }) => {
          return {
            title: i18n.t(route.params.title_key, { locale: data.localeReal }),
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

export default SongsNavigator;
