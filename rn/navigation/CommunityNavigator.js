// @flow
import React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import CommunityScreen from '../screens/CommunityScreen';
import ContactImportButton from '../screens/ContactImportButton';
import I18n from '../../translations';

const Stack = createStackNavigator();

const CommunityNavigator = () => {
  return (
    <Stack.Navigator screenOptions={StackNavigatorOptions()}>
      <Stack.Screen
        name="Community"
        component={CommunityScreen}
        options={({ navigation, route }) => {
          return {
            title: I18n.t('screen_title.community'),
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
