// @flow
import { createStackNavigator } from 'react-navigation';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';
import ListDetail from './screens/ListDetail';
import PDFViewer from './screens/PDFViewer';
import AppNavigatorConfig from './AppNavigatorConfig';
import MenuNavigator from './MenuNavigator';

const AppNavigator = createStackNavigator(
  {
    Menu: MenuNavigator,
    SalmoList: SalmoList,
    SalmoDetail: SalmoDetail,
    PDFViewer: PDFViewer,
    ListDetail: ListDetail
  },
  AppNavigatorConfig
);

export default AppNavigator;
