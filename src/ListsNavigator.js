// @flow
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import ListScreen from './screens/ListScreen';
import ListDetail from './screens/ListDetail';

const ListsNavigator = createStackNavigator(
  {
    Lists: ListScreen,
    ListDetail: ListDetail
  },
  {
    defaultNavigationOptions: StackNavigatorOptions
  }
);

ListsNavigator.navigationOptions = () => ({
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="bookmark"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  }
});

export default ListsNavigator;
