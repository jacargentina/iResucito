import * as React from 'react';
import { HStack } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import SongSearch from '../screens/SongSearch';
import SongList from '../screens/SongList';
import SongDetail from '../screens/SongDetail';
import PDFViewer from '../screens/PDFViewer';
import SharePDFButton from '../components/SharePDFButton';
import PrintPDFButton from '../components/PrintPDFButton';
import I18n from '@iresucito/translations';
import { useData } from '../DataContext';
import useStackNavOptions from './useStackNavOptions';
import SongDetailOptions from './SongDetailOptions';
import { Song } from '@iresucito/core';

type SongsStackParamList = {
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
          title: I18n.t('screen_title.search', { locale: data.localeReal }),
        }}
      />
      <Stack.Screen
        name="SongList"
        component={SongList}
        options={({ route }) => {
          return {
            title: I18n.t(route.params.title_key, { locale: data.localeReal }),
          };
        }}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetail}
        options={SongDetailOptions}
      />
      <Stack.Screen
        name="PDFViewer"
        component={PDFViewer}
        options={({ route }) => {
          const { title } = route.params;
          return {
            title: `PDF - ${title}`,
            headerRight: () => (
              <HStack m="1">
                <SharePDFButton />
                <PrintPDFButton />
              </HStack>
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default SongsNavigator;
