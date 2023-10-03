import { useState } from 'react';
import { Keyboard } from 'react-native';
import * as Sharing from 'expo-sharing';
import {
  Actionsheet,
  ActionsheetContent,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetBackdrop,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  HStack,
} from '@gluestack-ui/themed';
import {
  StackNavigationProp,
  createStackNavigator,
} from '@react-navigation/stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import i18n from '@iresucito/translations';
import { PDFViewer, ListScreen, ListDetail, SongDetail } from '../screens';
import { HeaderButton } from '../components';
import { Song } from '@iresucito/core';
import { useListsStore, useSettingsStore } from '../hooks';
import {
  getSongDetailOptions,
  getPdfViewerOptions,
  RootStackParamList,
  useStackNavOptions,
  SongsStackParamList,
} from './index';

export type ListsStackParamList = {
  ListsSearch: undefined;
  ListDetail: { listName: string };
  SongDetail: { song: Song };
  PDFViewer: { uri: string; title: string };
};

type ListDetailRouteProp = RouteProp<ListsStackParamList, 'ListDetail'>;

type SongChooserScreenNavigationProp = BottomTabNavigationProp<
  RootStackParamList,
  'SongChooser'
>;

const AddSongButton = () => {
  const { lists_ui } = useListsStore();
  const navigation = useNavigation<SongChooserScreenNavigationProp>();
  const route = useRoute<ListDetailRouteProp>();
  const { listName } = route.params;

  const uiList = lists_ui.find((l) => l.name == listName);

  if (uiList?.type !== 'libre') {
    return null;
  }

  return (
    <HeaderButton
      iconName="PlusIcon"
      onPress={() =>
        navigation.navigate('SongChooser', {
          screen: 'Dialog',
          params: {
            target: { listName: listName, listKey: uiList.items.length },
          },
        })
      }
    />
  );
};

type PDFViewerScreenNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'PDFViewer'
>;

const ShareListButton = () => {
  const navigation = useNavigation<PDFViewerScreenNavigationProp>();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);
  const route = useRoute<ListDetailRouteProp>();
  const { listName } = route.params;
  const { shareList } = useListsStore();

  return (
    <>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent pb="$8">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem
            testID="share-list-native"
            onPress={() => {
              handleClose();
              const listPath = shareList(listName, 'native');
              Sharing.shareAsync(`file://${listPath}`, {
                dialogTitle: i18n.t('ui.share'),
              });
            }}>
            <ActionsheetItemText>
              {i18n.t('list_export_options.native')}
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            testID="share-list-text"
            onPress={async () => {
              handleClose();
              const listPath = await shareList(listName, 'text');
              Sharing.shareAsync(`file://${listPath}`, {
                dialogTitle: i18n.t('ui.share'),
              });
            }}>
            <ActionsheetItemText>
              {i18n.t('list_export_options.plain text')}
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            testID="share-list-pdf"
            onPress={async () => {
              handleClose();
              const path = await shareList(listName, 'pdf');
              navigation.navigate('PDFViewer', {
                uri: path,
                title: listName,
              });
            }}>
            <ActionsheetItemText>
              {i18n.t('list_export_options.pdf file')}
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
      <HeaderButton
        testID="share-list-button"
        iconName="ShareIcon"
        onPress={() => {
          Keyboard.dismiss();
          setShowActionsheet(true);
        }}
      />
    </>
  );
};

const Stack = createStackNavigator<ListsStackParamList>();

export const ListsNavigator = () => {
  const options = useStackNavOptions();
  const { computedLocale } = useSettingsStore();
  return (
    <Stack.Navigator screenOptions={options}>
      <Stack.Screen
        name="ListsSearch"
        component={ListScreen}
        options={() => {
          return {
            title: i18n.t('screen_title.lists', {
              locale: computedLocale,
            }),
          };
        }}
      />
      <Stack.Screen
        name="ListDetail"
        component={ListDetail}
        options={({ route }) => {
          const { listName } = route.params;
          return {
            title: listName ? listName : 'Lista',
            headerRight: () => (
              <HStack m="$1">
                <ShareListButton />
                <AddSongButton />
              </HStack>
            ),
          };
        }}
      />
      <Stack.Screen
        name="SongDetail"
        component={SongDetail}
        options={({ route }) => getSongDetailOptions(route.params.song)}
      />
      <Stack.Screen
        name="PDFViewer"
        component={PDFViewer}
        options={({ route }) => getPdfViewerOptions(route.params.title)}
      />
    </Stack.Navigator>
  );
};
