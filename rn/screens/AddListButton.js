// @flow
import React, { useContext } from 'react';
import { Icon } from 'native-base';
import { DataContext } from '../DataContext';
import { useNavigation } from '@react-navigation/native';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';

const AddListButton = () => {
  const { navigation } = useNavigation();
  const data = useContext(DataContext);
  const { chooseListTypeForAdd } = data.lists;
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
      onPress={() => chooseListTypeForAdd(navigation)}
    />
  );
};

export default AddListButton;
