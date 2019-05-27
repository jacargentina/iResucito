// @flow
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import SongSearch from '../screens/SongSearch';
import SongList from '../screens/SongList';
import SongDetail from '../screens/SongDetail';
import UnassignedList from '../screens/UnassignedList';
import PDFViewer from '../screens/PDFViewer';

const SongsNavigator = createStackNavigator(
  {
    SongSearch: SongSearch,
    SongList: SongList,
    SongDetail: SongDetail,
    PDFViewer: PDFViewer,
    UnassignedList: UnassignedList
  },
  {
    defaultNavigationOptions: StackNavigatorOptions
  }
);

SongsNavigator.navigationOptions = () => ({
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="search"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  }
});

export default SongsNavigator;
