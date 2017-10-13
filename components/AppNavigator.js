import { Platform } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import MenuScreen from './screens/MenuScreen';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';
import SettingsScreen from './screens/SettingsScreen';
import ListScreen from './screens/ListScreen';
import ListDetail from './screens/ListDetail';

export const appNavigatorConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: '#8D6E63'
    },
    headerTitleStyle: {
      color: 'white'
    },
    headerBackTitleStyle: {
      color: 'white'
    },
    headerTintColor: 'white',
    headerTruncatedBackTitle: 'Atrás'
  },
  cardStyle: {
    backgroundColor: 'white'
  }
};

if (Platform.OS == 'android') {
  var tabBarOptions = {
    style: {
      backgroundColor: '#A1887F'
    }
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
  appNavigatorConfig
);

export default AppNavigator;
