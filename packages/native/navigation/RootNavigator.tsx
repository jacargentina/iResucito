import { createStackNavigator } from '@react-navigation/stack';
import { NavigatorScreenParams } from '@react-navigation/native';
import {
  SongPreviewScreenDialog,
  ContactImportDialog,
  ContactChooserDialog,
  ListNameDialog,
} from '../screens';
import {
  useStackNavOptions,
  SongChooserNavigator,
  MenuNavigator,
  ChooserParamList,
  MenuParamList,
} from './index';
import {
  EucaristiaList,
  LibreList,
  ListAction,
  ListType,
  PalabraList,
} from '@iresucito/core';
import { GeneratePDFResult } from '../pdf';

export type RootStackParamList = {
  Menu: NavigatorScreenParams<MenuParamList>;
  SongChooser: NavigatorScreenParams<ChooserParamList>;
  ContactChooser: {
    target: {
      listName: string;
      listKey:
        | keyof LibreList
        | keyof EucaristiaList
        | keyof PalabraList
        | number;
    };
  };
  ContactImport: undefined;
  SongPreviewScreen: undefined;
  SongPreviewPdf: { data: GeneratePDFResult };
};

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const options = useStackNavOptions();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="Menu"
        component={MenuNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Group
        screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <Stack.Screen name="SongChooser" component={SongChooserNavigator} />
        <Stack.Screen name="ContactChooser" component={ContactChooserDialog} />
        <Stack.Screen name="ContactImport" component={ContactImportDialog} />
        <Stack.Screen
          name="SongPreviewScreen"
          component={SongPreviewScreenDialog}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};
