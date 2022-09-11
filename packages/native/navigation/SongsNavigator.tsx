import * as React from 'react';
import { useContext } from 'react';
import { HStack } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import SongSearch from '../screens/SongSearch';
import SongList from '../screens/SongList';
import SongDetail from '../screens/SongDetail';
import PDFViewer from '../screens/PDFViewer';
import SharePDFButton from '../components/SharePDFButton';
import PrintPDFButton from '../components/PrintPDFButton';
import I18n from '@iresucito/translations';
import { DataContext } from '../DataContext';
import useStackNavOptions from './useStackNavOptions';
import SongDetailOptions from './SongDetailOptions';

const Stack = createStackNavigator();

const SongsNavigator = (): React.Node => {
  const data = useContext(DataContext);
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
        options={({ navigation, route }) => {
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
        options={({ navigation, route }) => {
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
