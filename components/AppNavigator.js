import { Platform } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import MenuScreen from './screens/MenuScreen';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';
import SettingsScreen from './screens/SettingsScreen';
import ListScreen from './screens/ListScreen';
import ListDetail from './screens/ListDetail';
import AppNavigatorConfig from './AppNavigatorConfig';

var tabBarOptions = {};

if (Platform.OS == 'android') {
  tabBarOptions.style = {
    backgroundColor: '#A1887F'
  };
} else {
  tabBarOptions.labelStyle = {
    fontSize: 14
  };
  tabBarOptions.style = {
  };
}

const MenuNavigator = TabNavigator(
  {
    Menu: { screen: MenuScreen },
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
