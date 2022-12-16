import * as React from 'react';
import { VStack, HStack, Icon, Text, Pressable } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ContactPhoto from '../components/ContactPhoto';
import { Contact } from 'react-native-contacts';

const ContactListItem = (props: { item: Contact }) => {
  const { item, ...rest } = props;
  var contactFullName = `${item.givenName} ${item.familyName}`;
  return (
    <Pressable {...rest}>
      <HStack
        space={1}
        p="2"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor="muted.200">
        <ContactPhoto item={item} />
        <VStack p="2" w="70%">
          <Text bold fontSize="lg">
            {item.givenName}
          </Text>
          <Text>{contactFullName}</Text>
        </VStack>
        {item.s === true && (
          <Icon as={Ionicons} name="musical-notes" color="rose.400" size="lg" />
        )}
      </HStack>
    </Pressable>
  );
};

export default ContactListItem;
