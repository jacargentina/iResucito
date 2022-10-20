import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CommunityScreen from '../screens/CommunityScreen';
import I18n from '@iresucito/translations';
import { useData } from '../DataContext';
import { useStackNavOptions } from './util';

const Stack = createStackNavigator();

const CommunityNavigator = () => {
  const data = useData();
  const options = useStackNavOptions();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="CommunitySearch"
        component={CommunityScreen}
        options={() => {
          return {
            title: I18n.t('screen_title.community', {
              locale: data.localeReal,
            }),
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default CommunityNavigator;
