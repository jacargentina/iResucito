import { createStackNavigator } from '@react-navigation/stack';
import { CommunityScreen } from '../screens';
import i18n from '@iresucito/translations';
import { useStackNavOptions } from './util';
import { useSettingsStore } from '../hooks';

export type CommunityStackParamList = {
  CommunitySearch: undefined;
};

const Stack = createStackNavigator<CommunityStackParamList>();

export const CommunityNavigator = () => {
  const options = useStackNavOptions();
  const { computedLocale } = useSettingsStore();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="CommunitySearch"
        component={CommunityScreen}
        options={() => {
          return {
            title: i18n.t('screen_title.community', {
              locale: computedLocale,
            }),
          };
        }}
      />
    </Stack.Navigator>
  );
};
