import { Platform } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import SalmoSearch from './screens/SalmoSearch';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';
import SettingsScreen from './screens/SettingsScreen';
import ListScreen from './screens/ListScreen';
import ListDetail from './screens/ListDetail';
import AppNavigatorConfig from './AppNavigatorConfig';

var tabBarOptions = {};

if (Platform.OS == 'android') {
  tabBarOptions.style = {
    backgroundColor: '#8D6E63'
  };
  tabBarOptions.iconStyle = {
    height: 30
  };
  // tabBarOptions.activeTintColor = '#A1887F';
  // tabBarOptions.inactiveTintColor = 'gray';
  tabBarOptions.indicatorStyle = {
    backgroundColor: 'white',
    height: 3
  };
  tabBarOptions.showIcon = true;
  tabBarOptions.showLabel = false;
} else {
  tabBarOptions.labelStyle = {
    fontSize: 14
  };
  tabBarOptions.style = {};
}

const MenuNavigator = TabNavigator(
  {
    Search: { screen: SalmoSearch },
    Lists: { screen: ListScreen },
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
