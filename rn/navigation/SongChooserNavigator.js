// @flow
import { createStackNavigator } from 'react-navigation-stack';
import StackNavigatorOptions from './StackNavigatorOptions';
import SongChooserDialog from '../screens/SongChooserDialog';
import SongPreviewScreenDialog from '../screens/SongPreviewScreenDialog';

const SongChooserNavigator = createStackNavigator(
  {
    Dialog: SongChooserDialog,
    ViewSong: SongPreviewScreenDialog
  },
  {
    mode: 'modal',
    headerMode: 'none',
    defaultNavigationOptions: ({ navigation }) => {
      var result = StackNavigatorOptions();
      return result;
    }
  }
);

export default SongChooserNavigator;
