// @flow
import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import ListScreen from '../screens/ListScreen';
import ListDetail from '../screens/ListDetail';
import SongDetail from '../screens/SongDetail';
import PDFViewer from '../screens/PDFViewer';
import ShareButton from '../screens/ShareButton';
import PrintButton from '../screens/PrintButton';

const Stack = createStackNavigator();

const ListsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen name="Lists" component={ListScreen} />
      <Stack.Screen name="ListDetail" component={ListDetail} />
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
                <ShareButton navigation={navigation} route={route} />
                <PrintButton navigation={navigation} route={route} />
              </View>
            )
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default ListsNavigator;
