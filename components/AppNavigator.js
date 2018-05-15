import { createStackNavigator } from 'react-navigation';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';
import ListDetail from './screens/ListDetail';
import PDFViewer from './screens/PDFViewer';
import AppNavigatorConfig from './AppNavigatorConfig';
import MenuNavigator from './MenuNavigator';

const AppNavigator = createStackNavigator(
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
    PDFViewer: {
      screen: PDFViewer
    },
    ListDetail: {
      screen: ListDetail
    },
  },
  AppNavigatorConfig
);

export default AppNavigator;
