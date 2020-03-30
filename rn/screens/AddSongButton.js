// @flow
import React, { useContext } from 'react';
import { Icon } from 'native-base';
import { DataContext } from '../DataContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';

const AddSongButton = (props: any) => {
  const data = useContext(DataContext);
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
      name="add"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions().headerTitleStyle.color,
      }}
      onPress={() =>
        navigation.navigate('SongChooser', {
          target: { listName: listName, listKey: uiList.items.length },
        })
      }
    />
  );
};

export default AddSongButton;
