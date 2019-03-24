// @flow
import { createStackNavigator } from 'react-navigation';
import NavigationService from './NavigationService';
import MenuNavigator from './MenuNavigator';
import AboutDialog from '../screens/AboutDialog';
import SalmoChooserDialog from '../screens/SalmoChooserDialog';
import SalmoChooseLocaleDialog from '../screens/SalmoChooseLocaleDialog';
import ContactChooserDialog from '../screens/ContactChooserDialog';
import ContactImportDialog from '../screens/ContactImportDialog';
import ListNameDialog from '../screens/ListNameDialog';

const RootNavigator = createStackNavigator(
  {
    Menu: MenuNavigator,
    About: AboutDialog,
    SalmoChooser: SalmoChooserDialog,
    SalmoChooseLocale: SalmoChooseLocaleDialog,
    ContactChooser: ContactChooserDialog,
    ContactImport: ContactImportDialog,
    ListName: ListNameDialog
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);

NavigationService.applyCancelHandler(RootNavigator.router);

export default RootNavigator;
