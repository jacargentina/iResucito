import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/SettingsScreen';
import i18n from '@iresucito/translations';
import useStackNavOptions from './StackNavOptions';

export type SettingsStackParamList = {
  SettingsScreen: { title: string };
};

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  const options = useStackNavOptions();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={() => {
          return { title: i18n.t('screen_title.settings') };
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
