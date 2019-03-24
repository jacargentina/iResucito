// @flow
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import CommunityScreen from '../screens/CommunityScreen';
import withI18nTitle from './withI18nTitle';

const CommunityNavigator = createStackNavigator(
  {
    Community: withI18nTitle(CommunityScreen, 'screen_title.community')
  },
  {
    defaultNavigationOptions: StackNavigatorOptions
  }
);

CommunityNavigator.navigationOptions = () => ({
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="contacts"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  }
});

export default CommunityNavigator;
