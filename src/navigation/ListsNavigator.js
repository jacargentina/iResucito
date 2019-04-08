// @flow
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import ListScreen from '../screens/ListScreen';
import ListDetail from '../screens/ListDetail';
import SongDetail from '../screens/SongDetail';

const ListsNavigator = createStackNavigator(
  {
    Lists: ListScreen,
    ListDetail: ListDetail,
    SongDetail: SongDetail
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
