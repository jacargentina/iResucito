// @flow
import React, { useContext } from 'react';
import { Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { DataContext } from '../DataContext';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';

const ContactImportButton = () => {
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const { contactImport } = data.community;

  return (
    <Icon
      name="plus"
      type="FontAwesome"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions().headerTitleStyle.color,
      }}
      onPress={() => contactImport(navigation)}
    />
  );
};

export default ContactImportButton;
