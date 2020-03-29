// @flow
import React, { useContext } from 'react';
import { Icon } from 'native-base';
import { DataContext } from '../DataContext';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';

const ContactImportButton = () => {
  const data = useContext(DataContext);
  const { contactImport } = data.community;

  return (
    <Icon
      name="add"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions().headerTitleStyle.color
      }}
      onPress={contactImport}
    />
  );
};

export default ContactImportButton;
