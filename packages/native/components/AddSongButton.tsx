import * as React from 'react';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useData } from '../DataContext';
import useStackNavOptions from '../navigation/useStackNavOptions';

const AddSongButton = (props: any) => {
  const options = useStackNavOptions();
  const data = useData();
  const { getListForUI } = data.lists;
  const navigation = useNavigation();
  const route = useRoute();
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
        color: options.headerTitleStyle.color,
      }}
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
