// @flow
import * as React from 'react';
import { useContext } from 'react';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { DataContext } from '../DataContext';
import useStackNavOptions from '../navigation/useStackNavOptions';

const ContactImportButton = (): React.Node => {
  const data = useContext(DataContext);
  const options = useStackNavOptions();
  const navigation = useNavigation();
  const { contactImport } = data.community;

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
      onPress={() => contactImport(navigation)}
    />
  );
};

export default ContactImportButton;
