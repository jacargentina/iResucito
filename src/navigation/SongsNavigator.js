// @flow
import React from 'react';
import { createStackNavigator } from 'react-navigation';
import StackNavigatorOptions from './StackNavigatorOptions';
import { Icon } from 'native-base';
import SalmoSearch from '../screens/SalmoSearch';
import SalmoList from '../screens/SalmoList';
import SalmoDetail from '../screens/SalmoDetail';
import UnassignedList from '../screens/UnassignedList';
import PDFViewer from '../screens/PDFViewer';
import withI18nTitle from './withI18nTitle';

const SongsNavigator = createStackNavigator(
  {
    SalmoSearch: withI18nTitle(SalmoSearch, 'screen_title.search'),
    SalmoList: SalmoList,
    SalmoDetail: SalmoDetail,
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
