// @flow
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import commonTheme from '../native-base-theme/variables/platform';
import SongsNavigator from './SongsNavigator';
import ListsNavigator from './ListsNavigator';
import CommunityNavigator from './CommunityNavigator';
import SettingsNavigator from './SettingsNavigator';

var tabBarOptions = {};
tabBarOptions.showLabel = false;
tabBarOptions.activeTintColor = commonTheme.brandPrimary;
tabBarOptions.style = {
  backgroundColor: 'white'
};

if (Platform.OS == 'android') {
  tabBarOptions.inactiveTintColor = 'gray';
  tabBarOptions.style = {
    backgroundColor: 'white'
  };
  tabBarOptions.pressColor = commonTheme.brandPrimary;
  tabBarOptions.iconStyle = {
    height: 30
  };
  tabBarOptions.indicatorStyle = {
    backgroundColor: tabBarOptions.activeTintColor,
    height: 3
  };
  tabBarOptions.showIcon = true;
}

const MenuNavigator = createBottomTabNavigator(
  {
    Songs: SongsNavigator,
    Lists: ListsNavigator,
    Community: CommunityNavigator,
    Settings: SettingsNavigator
  },
  {
    swipeEnabled: false,
    tabBarOptions: tabBarOptions
  }
);

export default MenuNavigator;
