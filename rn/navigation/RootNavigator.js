// @flow
import { createStackNavigator } from 'react-navigation-stack';
import NavigationService from './NavigationService';
import MenuNavigator from './MenuNavigator';
import SongChooserNavigator from './SongChooserNavigator';
import AboutDialog from '../screens/AboutDialog';
import SongChooseLocaleDialog from '../screens/SongChooseLocaleDialog';
import ContactChooserDialog from '../screens/ContactChooserDialog';
import ContactImportDialog from '../screens/ContactImportDialog';
import ListNameDialog from '../screens/ListNameDialog';
import SongChangeNameDialog from '../screens/SongChangeNameDialog';
import SongEditorDialog from '../screens/SongEditorDialog';
import SongPreviewScreenDialog from '../screens/SongPreviewScreenDialog';
import SongPreviewPdfDialog from '../screens/SongPreviewPdfDialog';

const RootNavigator = createStackNavigator(
  {
    Menu: MenuNavigator,
    About: AboutDialog,
    SongChooser: SongChooserNavigator,
    SongChooseLocale: SongChooseLocaleDialog,
    ContactChooser: ContactChooserDialog,
    ContactImport: ContactImportDialog,
    ListName: ListNameDialog,
    SongChangeName: SongChangeNameDialog,
    SongEditor: SongEditorDialog,
    SongPreviewScreen: SongPreviewScreenDialog,
    SongPreviewPdf: SongPreviewPdfDialog
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);

NavigationService.applyCancelHandler(RootNavigator.router);

export default RootNavigator;
