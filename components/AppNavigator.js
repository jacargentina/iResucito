import { StackNavigator, TabNavigator } from 'react-navigation';
import MenuScreen from './screens/MenuScreen';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';
import SettingsScreen from './screens/SettingsScreen';
import ListScreen from './screens/ListScreen';

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
    headerTintColor: 'white'
  },
  cardStyle: {
    backgroundColor: 'white'
  }
};

const MenuNavigator = TabNavigator({
  Menu: { screen: MenuScreen },
  Lists: { screen: ListScreen },
  Settings: { screen: SettingsScreen }
});

const AppNavigator = StackNavigator(
  {
    Menu: {
      screen: MenuNavigator
    },
    List: {
      screen: SalmoList
    },
    Detail: {
      screen: SalmoDetail
    }
  },
  appNavigatorConfig
);

export default AppNavigator;
