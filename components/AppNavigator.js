import { Platform } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import SalmoSearch from './screens/SalmoSearch';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';
import SettingsScreen from './screens/SettingsScreen';
import ListScreen from './screens/ListScreen';
import ListDetail from './screens/ListDetail';
import CommunityScreen from './screens/CommunityScreen';
import AppNavigatorConfig from './AppNavigatorConfig';
import commonTheme from '../native-base-theme/variables/platform';
import color from 'color';

var tabBarOptions = {};

if (Platform.OS == 'android') {
  tabBarOptions.activeTintColor = 'white';
  tabBarOptions.inactiveTintColor = color(tabBarOptions.activeTintColor)
    .darken(0.1)
    .string();
  tabBarOptions.style = {
    backgroundColor: color(commonTheme.brandPrimary)
      .lighten(0.2)
      .string()
  };
  tabBarOptions.iconStyle = {
    height: 30
  };
  // tabBarOptions.inactiveTintColor = 'gray';
  tabBarOptions.indicatorStyle = {
    backgroundColor: tabBarOptions.activeTintColor,
    height: 3
  };
  tabBarOptions.showIcon = true;
  tabBarOptions.showLabel = false;
} else {
  tabBarOptions.activeTintColor = commonTheme.brandPrimary;
  tabBarOptions.labelStyle = {
    fontSize: 12
  };
  tabBarOptions.style = {};
}

const MenuNavigator = TabNavigator(
  {
    Search: { screen: SalmoSearch },
    Lists: { screen: ListScreen },
    Community: { screen: CommunityScreen },
    Settings: { screen: SettingsScreen }
  },
  {
    swipeEnabled: false,
    tabBarOptions: tabBarOptions
  }
);

const AppNavigator = StackNavigator(
  {
    Menu: {
      screen: MenuNavigator
    },
    SalmoList: {
      screen: SalmoList
    },
    SalmoDetail: {
      screen: SalmoDetail
    },
    ListDetail: {
      screen: ListDetail
    }
  },
  AppNavigatorConfig
);

export default AppNavigator;
