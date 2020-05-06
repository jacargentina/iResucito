// @flow
import React, { useContext } from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import CommunityScreen from '../screens/CommunityScreen';
import ContactImportButton from '../screens/ContactImportButton';
import I18n from '../../translations';
import { DataContext } from '../DataContext';

const Stack = createStackNavigator();

const CommunityNavigator = () => {
  const data = useContext(DataContext);
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen
        name="Community"
        component={CommunityScreen}
        options={({ navigation, route }) => {
          return {
            title: I18n.t('screen_title.community', {
              locale: data.localeReal,
            }),
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <ContactImportButton Read-WithDefault />
              </View>
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default CommunityNavigator;
