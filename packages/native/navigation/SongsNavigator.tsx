
import { createStackNavigator } from '@react-navigation/stack';
import { PDFViewer, SongDetail, SongList, SongSearch } from '../screens';
import i18n from '@iresucito/translations';
import {
  useStackNavOptions,
  getSongDetailOptions,
  getPdfViewerOptions,
} from './index';
import { Song } from '@iresucito/core';
import { useSettingsStore } from '../hooks';

export type SongsStackParamList = {
  SongSearch: undefined;
  SongList: { title_key: string; filter?: any; sort?: Function };
  SongDetail: { song: Song };
  PDFViewer: { uri: string; title: string };
};

const Stack = createStackNavigator<SongsStackParamList>();

export const SongsNavigator = () => {
  const options = useStackNavOptions();
  const { computedLocale } = useSettingsStore();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="SongSearch"
        component={SongSearch}
        options={{
          title: i18n.t('screen_title.search', { locale: computedLocale }),
        }}
      />
      <Stack.Screen
        name="SongList"
        component={SongList}
        options={({ route }) => {
          return {
            title: i18n.t(route.params.title_key, { locale: computedLocale }),
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
