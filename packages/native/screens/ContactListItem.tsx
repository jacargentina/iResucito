import * as React from 'react';
import { VStack, HStack, Icon, Text, Pressable } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ContactPhoto from '../components/ContactPhoto';
import { BrotherContact } from '../DataContext';

const ContactListItem = (props: { item: BrotherContact; [x: string]: any }) => {
  const { item, ...rest } = props;
  var contactFullName = item.givenName;
  if (item.familyName) {
    if (contactFullName.length > 0) {
      contactFullName += ' ';
    }
    contactFullName += item.familyName;
  }
  return (
    <Pressable {...rest}>
      <HStack
        space="2"
        p="2"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor="muted.200">
        <ContactPhoto item={item} />
        <VStack w="75%">
          <Text bold fontSize="lg" noOfLines={1}>
            {contactFullName}
          </Text>
          <Text noOfLines={1}>
            {item.emailAddresses && item.emailAddresses.length > 0
              ? item.emailAddresses[0].email
              : null}
          </Text>
        </VStack>
        {item.s === true && (
          <Icon as={Ionicons} name="musical-notes" color="rose.400" size="lg" />
        )}
      </HStack>
    </Pressable>
  );
};

export default ContactListItem;
