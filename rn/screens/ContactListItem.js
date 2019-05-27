// @flow
import React from 'react';
import { ListItem, Right, Body, Icon, Text } from 'native-base';
import { View } from 'react-native';
import commonTheme from '../native-base-theme/variables/platform';
import ContactPhoto from './ContactPhoto';

const ContactListItem = (props: any) => {
  const { item, ...rest } = props;
  var contactFullName = `${item.givenName} ${item.familyName}`;
  var flags = (
    <View style={{ flexDirection: 'row' }}>
      {item.s === true && (
        <Icon
          name="musical-notes"
          style={{
            marginRight: 4,
            color: commonTheme.brandPrimary,
            fontSize: 28
          }}
        />
      )}
    </View>
  );
  return (
    <ListItem button {...rest}>
      <ContactPhoto item={item} />
      <Body>
        <Text>{item.givenName}</Text>
        <Text note>{contactFullName}</Text>
      </Body>
      <Right>{flags}</Right>
    </ListItem>
  );
};

export default ContactListItem;
