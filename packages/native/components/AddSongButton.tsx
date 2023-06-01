import * as React from 'react';
import { Icon } from '../gluestack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useListsStore } from '../hooks';
import {
  useStackNavOptions,
  ListsStackParamList,
  RootStackParamList,
} from '../navigation';
import { PlusIcon } from 'lucide-react-native';

type ListDetailRouteProp = RouteProp<ListsStackParamList, 'ListDetail'>;

type SongChooserScreenNavigationProp = BottomTabNavigationProp<
  RootStackParamList,
  'SongChooser'
>;

export const AddSongButton = () => {
  const options = useStackNavOptions();
  const { lists_ui } = useListsStore();
  const navigation = useNavigation<SongChooserScreenNavigationProp>();
  const route = useRoute<ListDetailRouteProp>();
  const { listName } = route.params;

  const uiList = lists_ui.find((l) => l.name == listName);

  if (uiList?.type !== 'libre') {
    return null;
  }

  return (
    <Icon
      as={PlusIcon}
      size="xl"
      style={{
        marginTop: 4,
        marginRight: 8,
      }}
      color={options.headerTitleStyle.color}
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
