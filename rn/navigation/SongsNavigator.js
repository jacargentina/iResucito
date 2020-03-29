// @flow
import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import SongSearch from '../screens/SongSearch';
import SongList from '../screens/SongList';
import SongDetail from '../screens/SongDetail';
import UnassignedList from '../screens/UnassignedList';
import PDFViewer from '../screens/PDFViewer';
import ViewPdfButton from '../screens/ViewPdfButton';
import TransportNotesButton from '../screens/TransportNotesButton';
import SharePDFButton from '../screens/SharePDFButton';
import PrintPDFButton from '../screens/PrintPDFButton';
import ExportToPdfButton from '../screens/ExportToPdfButton';
import ClearRatingsButton from '../screens/ClearRatingsButton';
import I18n from '../../translations';

const Stack = createStackNavigator();

const SongsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen
        name="SongSearch"
        component={SongSearch}
        options={{ title: I18n.t('screen_title.search') }}
      />
      <Stack.Screen
        name="SongList"
        component={SongList}
        options={({ navigation, route }) => {
          return {
            title: I18n.t(route.params.title_key),
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <ExportToPdfButton />
                <ClearRatingsButton />
              </View>
            )
          };
        }}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetail}
        options={({ navigation, route }) => {
          const song = route.params.song;
          return {
            title: song ? song.titulo : 'Salmo',
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <ViewPdfButton navigation={navigation} route={route} />
                <TransportNotesButton navigation={navigation} route={route} />
              </View>
            )
          };
        }}
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
                <SharePDFButton navigation={navigation} route={route} />
                <PrintPDFButton navigation={navigation} route={route} />
              </View>
            )
          };
        }}
      />
      <Stack.Screen
        name="UnassignedList"
        component={UnassignedList}
        options={{ title: I18n.t('search_title.unassigned') }}
      />
    </Stack.Navigator>
  );
};

export default SongsNavigator;
