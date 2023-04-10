import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CommunityScreen from '../screens/CommunityScreen';
import i18n from '@iresucito/translations';
import { useLocale } from '../hooks';
import useStackNavOptions from './StackNavOptions';

export type CommunityStackParamList = {
  CommunitySearch: undefined;
};

const Stack = createStackNavigator<CommunityStackParamList>();

const CommunityNavigator = () => {
  const locale = useLocale();
  const options = useStackNavOptions();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="CommunitySearch"
        component={CommunityScreen}
        options={() => {
          return {
            title: i18n.t('screen_title.community', {
              locale,
            }),
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default CommunityNavigator;
