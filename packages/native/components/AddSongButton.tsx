import * as React from 'react';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useListsStore } from '../hooks';
import useStackNavOptions from '../navigation/StackNavOptions';

import type { ListsStackParamList } from '../navigation/ListsNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';

type ListDetailRouteProp = RouteProp<ListsStackParamList, 'ListDetail'>;

type SongChooserScreenNavigationProp = BottomTabNavigationProp<
  RootStackParamList,
  'SongChooser'
>;

const AddSongButton = () => {
  const options = useStackNavOptions();
  const { lists_forui } = useListsStore();
  const navigation = useNavigation<SongChooserScreenNavigationProp>();
  const route = useRoute<ListDetailRouteProp>();
  const { listName } = route.params;

  const uiList = lists_forui.find(l => l.name == listName);

  if (uiList?.type !== 'libre') {
    return null;
  }

  return (
    <Icon
      as={Ionicons}
      name="add"
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

export default AddSongButton;
