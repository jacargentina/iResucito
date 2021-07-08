// @flow
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ContactChooserDialog from '../screens/ContactChooserDialog';
import ListNameDialog from '../screens/ListNameDialog';
import ContactImportDialog from '../screens/ContactImportDialog';
import SongPreviewScreenDialog from '../screens/SongPreviewScreenDialog';
import SongPreviewPdfDialog from '../screens/SongPreviewPdfDialog';
import useStackNavOptions from './useStackNavOptions';
import MenuNavigator from './MenuNavigator';
import SongChooserNavigator from './SongChooserNavigator';

const Stack = createStackNavigator();

const RootNavigator = (): React.Node => {
  const options = useStackNavOptions();
  return (
    <Stack.Navigator mode="modal" headerMode="none" screenOptions={options}>
      <Stack.Screen name="Menu" component={MenuNavigator} />
      <Stack.Screen name="SongChooser" component={SongChooserNavigator} />
      <Stack.Screen name="ContactChooser" component={ContactChooserDialog} />
      <Stack.Screen name="ListName" component={ListNameDialog} />
      <Stack.Screen name="ContactImport" component={ContactImportDialog} />
      <Stack.Screen
        name="SongPreviewScreen"
        component={SongPreviewScreenDialog}
      />
      <Stack.Screen name="SongPreviewPdf" component={SongPreviewPdfDialog} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
