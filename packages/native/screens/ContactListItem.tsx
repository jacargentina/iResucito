import { VStack, HStack, Icon, Text, Pressable } from '@gluestack-ui/themed';
import { ContactPhoto } from '../components';
import { BrotherContact } from '../hooks';
import { MusicIcon } from 'lucide-react-native';
import { getContactSanitizedName } from '../util';

export const ContactListItem = (props: {
  item: BrotherContact;
  [x: string]: any;
}) => {
  const { item, ...rest } = props;
  return (
    <Pressable {...rest}>
      <HStack
        space="sm"
        p="$2"
        alignItems="center"
        borderBottomWidth={1}
        $light-borderBottomColor="$light200"
        $dark-borderBottomColor="$light600">
        <ContactPhoto item={item} />
        <VStack w="75%">
          <Text fontWeight="bold" fontSize="$lg" numberOfLines={1}>
            {getContactSanitizedName(item)}
          </Text>
          <Text numberOfLines={1}>
            {item.emails && item.emails.length > 0
              ? item.emails[0].email
              : null}
          </Text>
        </VStack>
        {item.s === true && <Icon as={MusicIcon} color="$rose400" size="lg" />}
      </HStack>
    </Pressable>
  );
};
