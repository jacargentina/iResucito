import * as React from 'react';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  CompositeNavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { useData } from '../DataContext';
import useStackNavOptions from '../navigation/StackNavOptions';

import type { ListsStackParamList } from '../navigation/ListsNavigator';
import type { RootStackParamList } from '../navigation/RootNavigator';
import type { ChooserParamList } from '../navigation/SongChooserNavigator';

type ListDetailRouteProp = RouteProp<ListsStackParamList, 'ListDetail'>;

type SongChooserScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, 'SongChooser'>,
  StackNavigationProp<ChooserParamList>
>;

const AddSongButton = () => {
  const options = useStackNavOptions();
  const data = useData();
  const { getListForUI } = data.lists;
  const navigation = useNavigation<SongChooserScreenNavigationProp>();
  const route = useRoute<ListDetailRouteProp>();
  const { listName } = route.params;

  const uiList = getListForUI(listName);

  if (uiList.type !== 'libre') {
    return null;
  }

  return (
    <Icon
      as={Ionicons}
      name="add"
      size="md"
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
