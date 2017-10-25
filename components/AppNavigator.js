import { StackNavigator } from 'react-navigation';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';
import ListDetail from './screens/ListDetail';
import AppNavigatorConfig from './AppNavigatorConfig';
import MenuNavigator from './MenuNavigator';

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
