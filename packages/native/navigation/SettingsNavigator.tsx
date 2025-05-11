import { createStackNavigator } from '@react-navigation/stack';
import i18n from '@iresucito/translations';
import { useStackNavOptions } from './util';
import { SettingsScreen } from '../screens';
import { useSettingsStore } from '../hooks';

export type SettingsStackParamList = {
  SettingsScreen: { title: string };
};

const Stack = createStackNavigator<SettingsStackParamList>();

export const SettingsNavigator = () => {
  const options = useStackNavOptions();
  const { computedLocale } = useSettingsStore();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={() => {
          return {
            title: i18n.t('screen_title.settings', { locale: computedLocale }),
          };
        }}
      />
    </Stack.Navigator>
  );
};
