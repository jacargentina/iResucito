import * as React from 'react';
import { VStack, HStack, Icon, Text, Pressable } from '../gluestack';
import { ContactPhoto } from '../components';
import { BrotherContact } from '../hooks';
import { MusicIcon } from 'lucide-react-native';

export const ContactListItem = (props: { item: BrotherContact; [x: string]: any }) => {
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
        space="$2"
        p="$2"
        alignItems="center"
        borderBottomWidth={1}
        borderBottomColor="$muted200">
        <ContactPhoto item={item} />
        <VStack w="75%">
          <Text fontWeight="bold" fontSize="$lg" numberOfLines={1}>
            {contactFullName}
          </Text>
          <Text numberOfLines={1}>
            {item.emailAddresses && item.emailAddresses.length > 0
              ? item.emailAddresses[0].email
              : null}
          </Text>
        </VStack>
        {item.s === true && <Icon as={MusicIcon} color="$rose400" size="lg" />}
      </HStack>
    </Pressable>
  );
};
