// @flow
import { createStackNavigator } from 'react-navigation';
import SalmosNavigatorOptions from './SalmosNavigatorOptions';
import SalmoSearch from './screens/SalmoSearch';
import SalmoList from './screens/SalmoList';
import SalmoDetail from './screens/SalmoDetail';
import ListDetail from './screens/ListDetail';
import UnassignedList from './screens/UnassignedList';
import PDFViewer from './screens/PDFViewer';

const SalmosNavigator = createStackNavigator(
  {
    SalmoSearch: SalmoSearch,
    SalmoList: SalmoList,
    SalmoDetail: SalmoDetail,
    PDFViewer: PDFViewer,
    ListDetail: ListDetail,
    UnassignedList: UnassignedList
  },
  {
    defaultNavigationOptions: SalmosNavigatorOptions,
    cardStyle: {
      backgroundColor: 'white'
    }
  }
);

export default SalmosNavigator;
