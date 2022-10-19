import * as React from 'react';
import { HStack } from 'native-base';
import { createStackNavigator } from '@react-navigation/stack';
import I18n from '@iresucito/translations';
import ListScreen from '../screens/ListScreen';
import ListDetail from '../screens/ListDetail';
import SongDetail from '../screens/SongDetail';
import PDFViewer from '../screens/PDFViewer';
import SharePDFButton from '../components/SharePDFButton';
import PrintPDFButton from '../components/PrintPDFButton';
import ShareListButton from '../components/ShareListButton';
import AddSongButton from '../components/AddSongButton';
import { useData } from '../DataContext';
import useStackNavOptions from './useStackNavOptions';
import SongDetailOptions from './SongDetailOptions';
import { Song } from '@iresucito/core';

type ListsStackParamList = {
  ListsSearch: undefined;
  ListDetail: { listName: string };
  SongDetail: { song: Song };
  PDFViewer: { uri: string; title: string };
};

const Stack = createStackNavigator<ListsStackParamList>();

const ListsNavigator = () => {
  const data = useData();
  const options = useStackNavOptions();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="ListsSearch"
        component={ListScreen}
        options={() => {
          return {
            title: I18n.t('screen_title.lists', {
              locale: data.localeReal,
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
              <HStack m="1">
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

export default ListsNavigator;
