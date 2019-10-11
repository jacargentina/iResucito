// @flow
import { createStackNavigator } from 'react-navigation-stack';
import SongChooserDialog from '../screens/SongChooserDialog';
import SongPreviewScreenDialog from '../screens/SongPreviewScreenDialog';

const SongChooserNavigator = createStackNavigator(
  {
    Dialog: SongChooserDialog,
    ViewSong: SongPreviewScreenDialog
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
);

export default SongChooserNavigator;
