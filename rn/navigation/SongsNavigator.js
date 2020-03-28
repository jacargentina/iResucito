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
import ShareButton from '../screens/ShareButton';
import PrintButton from '../screens/PrintButton';
import I18n from '../../translations';

const Stack = createStackNavigator();

const SongsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen name="SongSearch" component={SongSearch} />
      <Stack.Screen name="SongList" component={SongList} />
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
                <ShareButton navigation={navigation} route={route} />
                <PrintButton navigation={navigation} route={route} />
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
