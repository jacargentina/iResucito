// @flow
import { Platform } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import commonTheme from './native-base-theme/variables/platform';
import SalmosNavigator from './SalmosNavigator';
import SettingsScreen from './screens/SettingsScreen';
import ListScreen from './screens/ListScreen';
import CommunityScreen from './screens/CommunityScreen';

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
    Salmos: SalmosNavigator,
    Lists: ListScreen,
    Community: CommunityScreen,
    Settings: SettingsScreen
  },
  {
    swipeEnabled: false,
    tabBarOptions: tabBarOptions
  }
);

MenuNavigator.rootNavigation = null;

export default MenuNavigator;
