// @flow
import * as React from 'react';
import { useContext } from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import CommunityScreen from '../screens/CommunityScreen';
import ContactImportButton from '../components/ContactImportButton';
import I18n from '../../translations';
import { DataContext } from '../DataContext';
import useStackNavOptions from './useStackNavOptions';

const Stack = createStackNavigator();

const CommunityNavigator = (): React.Node => {
  const data = useContext(DataContext);
  const options = useStackNavOptions();
  return (
    <Stack.Navigator screenOptions={options}>
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
                <ContactImportButton />
              </View>
            ),
          };
        }}
      />
    </Stack.Navigator>
  );
};

export default CommunityNavigator;
