// @flow
import { createStackNavigator } from 'react-navigation';
import NavigationService from './NavigationService';
import MenuNavigator from './MenuNavigator';
import AboutDialog from '../screens/AboutDialog';
import SongChooserDialog from '../screens/SongChooserDialog';
import SongChooseLocaleDialog from '../screens/SongChooseLocaleDialog';
import ContactChooserDialog from '../screens/ContactChooserDialog';
import ContactImportDialog from '../screens/ContactImportDialog';
import ListNameDialog from '../screens/ListNameDialog';

const RootNavigator = createStackNavigator(
  {
    Menu: MenuNavigator,
    About: AboutDialog,
    SalmoChooser: SongChooserDialog,
    SalmoChooseLocale: SongChooseLocaleDialog,
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
