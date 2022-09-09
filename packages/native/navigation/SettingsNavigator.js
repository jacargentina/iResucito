// @flow
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '../screens/SettingsScreen';
import I18n from '@iresucito/translations';
import useStackNavOptions from './useStackNavOptions';

const Stack = createStackNavigator();

const SettingsNavigator = (): React.Node => {
  const options = useStackNavOptions();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={({ navigation, route }) => {
          return { title: I18n.t('screen_title.settings') };
        }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
