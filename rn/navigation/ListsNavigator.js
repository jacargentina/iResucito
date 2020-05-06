// @flow
import React, { useContext } from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import ListScreen from '../screens/ListScreen';
import ListDetail from '../screens/ListDetail';
import SongDetail from '../screens/SongDetail';
import SongDetailOptions from './SongDetailOptions';
import PDFViewer from '../screens/PDFViewer';
import SharePDFButton from '../screens/SharePDFButton';
import PrintPDFButton from '../screens/PrintPDFButton';
import ShareListButton from '../screens/ShareListButton';
import AddSongButton from '../screens/AddSongButton';
import AddListButton from '../screens/AddListButton';
import I18n from '../../translations';
import { DataContext } from '../DataContext';

const Stack = createStackNavigator();

const ListsNavigator = () => {
  const data = useContext(DataContext);
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen
        name="Lists"
        component={ListScreen}
        options={({ navigation, route }) => {
          return {
            title: I18n.t('screen_title.lists', {
              locale: data.localeReal,
            }),
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <AddListButton Read-WithDefault />
              </View>
            ),
          };
        }}
      />
      <Stack.Screen
        name="ListDetail"
        component={ListDetail}
        options={({ navigation, route }) => {
          const { listName } = route.params;
          return {
            title: listName ? listName : 'Lista',
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <ShareListButton Read-WithDefault />
                <AddSongButton Read-WithDefault />
              </View>
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
        options={({ navigation, route }) => {
          const { title } = route.params;
          return {
            title: `PDF - ${title}`,
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <SharePDFButton Read-WithDefault />
                <PrintPDFButton Read-WithDefault />
              </View>
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default ListsNavigator;
