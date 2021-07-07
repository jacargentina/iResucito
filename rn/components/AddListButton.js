// @flow
import * as React from 'react';
import { useContext } from 'react';
import { Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DataContext } from '../DataContext';
import useStackNavOptions from '../navigation/useStackNavOptions';

const AddListButton = (): React.Node => {
  const navigation = useNavigation();
  const options = useStackNavOptions();
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
      onPress={() => null}
    />
  );
};

export default AddListButton;
