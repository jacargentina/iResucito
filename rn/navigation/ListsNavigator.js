// @flow
import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import ListScreen from '../screens/ListScreen';
import ListDetail from '../screens/ListDetail';
import SongDetail from '../screens/SongDetail';
import PDFViewer from '../screens/PDFViewer';
import SharePDFButton from '../screens/SharePDFButton';
import PrintPDFButton from '../screens/PrintPDFButton';
import ShareListButton from '../screens/ShareListButton';
import AddSongButton from '../screens/AddSongButton';
import AddListButton from '../screens/AddListButton';
import I18n from '../../translations';

const Stack = createStackNavigator();

const ListsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen
        name="Lists"
        component={ListScreen}
        options={({ navigation, route }) => {
          return {
            title: I18n.t('screen_title.lists'),
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <AddListButton navigation={navigation} route={route} />
              </View>
            )
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
                <ShareListButton navigation={navigation} route={route} />
                <AddSongButton navigation={navigation} route={route} />
              </View>
            )
          };
        }}
      />
      <Stack.Screen name="SongDetail" component={SongDetail} />
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
    </Stack.Navigator>
  );
};

export default ListsNavigator;
