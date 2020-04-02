// @flow
import React, { useContext } from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import SongSearch from '../screens/SongSearch';
import SongList from '../screens/SongList';
import SongDetail from '../screens/SongDetail';
import SongDetailOptions from './SongDetailOptions';
import UnassignedList from '../screens/UnassignedList';
import PDFViewer from '../screens/PDFViewer';
import SharePDFButton from '../screens/SharePDFButton';
import PrintPDFButton from '../screens/PrintPDFButton';
import ExportToPdfButton from '../screens/ExportToPdfButton';
import ClearRatingsButton from '../screens/ClearRatingsButton';
import I18n from '../../translations';
import { DataContext } from '../DataContext';

const Stack = createStackNavigator();

const SongsNavigator = () => {
  const data = useContext(DataContext);
  const [localeValue] = data.locale;
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen
        name="SongSearch"
        component={SongSearch}
        options={{
          title: I18n.t('screen_title.search', { locale: localeValue }),
        }}
      />
      <Stack.Screen
        name="SongList"
        component={SongList}
        options={({ navigation, route }) => {
          return {
            title: I18n.t(route.params.title_key, { locale: localeValue }),
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <ExportToPdfButton />
                <ClearRatingsButton />
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
      <Stack.Screen
        name="UnassignedList"
        component={UnassignedList}
        options={{
          title: I18n.t('search_title.unassigned', { locale: localeValue }),
        }}
      />
    </Stack.Navigator>
  );
};

export default SongsNavigator;
