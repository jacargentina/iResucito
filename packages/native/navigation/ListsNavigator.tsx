import * as React from 'react';
import { Keyboard } from 'react-native';
import Share from 'react-native-share';
import { Actionsheet, HStack } from '@gluestack-ui/themed';
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
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);
  const route = useRoute<ListDetailRouteProp>();
  const { listName } = route.params;
  const { shareList } = useListsStore();

  return (
    <>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <Actionsheet.Backdrop />
        <Actionsheet.Content pb="$8">
          <Actionsheet.DragIndicatorWrapper>
            <Actionsheet.DragIndicator />
          </Actionsheet.DragIndicatorWrapper>
          <Actionsheet.Item
            testID="share-list-native"
            onPress={() => {
              handleClose();
              const listPath = shareList(listName, 'native');
              Share.open({
                title: i18n.t('ui.share'),
                subject: `iResucitó - ${listName}`,
                url: `file://${listPath}`,
                failOnCancel: false,
              }).catch((err) => {
                err && console.log(err);
              });
            }}>
            <Actionsheet.ItemText>
              {i18n.t('list_export_options.native')}
            </Actionsheet.ItemText>
          </Actionsheet.Item>
          <Actionsheet.Item
            testID="share-list-text"
            onPress={async () => {
              handleClose();
              const message = await shareList(listName, 'text');
              Share.open({
                title: i18n.t('ui.share'),
                message: message,
                subject: `iResucitó - ${listName}`,
                url: undefined,
                failOnCancel: false,
              }).catch((err) => {
                err && console.log(err);
              });
            }}>
            <Actionsheet.ItemText>
              {i18n.t('list_export_options.plain text')}
            </Actionsheet.ItemText>
          </Actionsheet.Item>
          <Actionsheet.Item
            testID="share-list-pdf"
            onPress={async () => {
              handleClose();
              const path = await shareList(listName, 'pdf');
              navigation.navigate('PDFViewer', {
                uri: path,
                title: listName,
              });
            }}>
            <Actionsheet.ItemText>
              {i18n.t('list_export_options.pdf file')}
            </Actionsheet.ItemText>
          </Actionsheet.Item>
        </Actionsheet.Content>
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
