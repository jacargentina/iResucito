import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { Text, Box, Pressable, HStack, VStack, Switch } from 'native-base';
import { Keyboard, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import ModalView from '../components/ModalView';
import SearchBarView from '../components/SearchBarView';
import ContactPhoto from '../components/ContactPhoto';
import { BrotherContact, useBrothersStore, useSettingsStore } from '../hooks';
import i18n from '@iresucito/translations';
import {
  getContactsForImport,
  contactFilterByText,
  ordenAlfabetico,
  ContactForImport,
} from '../util';
import { Contact } from 'react-native-contacts';

const BrotherItem = React.memo(
  (props: {
    item: BrotherContact;
    handleContact: (c: BrotherContact) => void;
  }) => {
    const { item, handleContact } = props;
    return (
      <Pressable
        style={{ marginRight: 10, width: 56 }}
        onPress={() => handleContact(item)}>
        <ContactPhoto item={item} />
        <Text noOfLines={1} textAlign="center" mt="2" fontSize="sm">
          {item.givenName && item.givenName.length > 0
            ? item.givenName.trim()
            : item.familyName.trim()}
        </Text>
      </Pressable>
    );
  }
);

const ContactItem = React.memo(
  (props: {
    item: ContactForImport;
    handleContact: (c: ContactForImport) => void;
  }) => {
    const { item, handleContact } = props;
    var contactFullName = item.givenName;
    if (item.familyName) {
      if (contactFullName.length > 0) {
        contactFullName += ' ';
      }
      contactFullName += item.familyName;
    }
    return (
      <Pressable onPress={() => handleContact(item)}>
        <HStack p="2" justifyContent="space-between" alignItems="center">
          <ContactPhoto item={item} />
          <VStack w="68%">
            <Text bold fontSize="lg" noOfLines={1}>
              {contactFullName}
            </Text>
            <Text noOfLines={1}>
              {item.emailAddresses && item.emailAddresses.length > 0
                ? item.emailAddresses[0].email
                : null}
            </Text>
          </VStack>
          <Switch
            isChecked={item.imported}
            onToggle={() => handleContact(item)}
          />
        </HStack>
      </Pressable>
    );
  }
);

const ContactImportDialog = () => {
  const { brothers, contacts, addOrRemove } = useBrothersStore();
  const { computedLocale } = useSettingsStore();
  const [loading, setLoading] = useState(false);
  const [contactsForImport, setContactsForImport] = useState<ContactForImport[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (contacts) {
      var withName = contacts.filter(
        (c) =>
          (c.givenName && c.givenName.length > 0) ||
          (c.familyName && c.familyName.length > 0)
      );
      var result = getContactsForImport(withName, brothers);
      setContactsForImport(result);
      setLoading(false);
    }
  }, [contacts, brothers]);

  const filtered = useMemo(() => {
    var result = contactsForImport.filter((c) => contactFilterByText(c, filter));
    result.sort(ordenAlfabetico);
    return result;
  }, [contactsForImport, filter]);

  const handleContact = (contact: Contact) => {
    addOrRemove(contact);
    setFilter('');
  };

  return (
    <ModalView
      left={
        <Text
          bold
          fontSize="md"
          mt="2"
          ml="4"
          style={{
            alignSelf: 'flex-start',
          }}>
          {i18n.t('screen_title.import contacts')}
        </Text>
      }
      closeText={i18n.t('ui.done')}>
      <SearchBarView value={filter} setValue={setFilter} placeholder={i18n.t("ui.search placeholder", { locale: computedLocale }) + '...'}>
        {brothers && brothers.length > 0 && (
          <Box
            p="4"
            borderBottomWidth={StyleSheet.hairlineWidth}
            borderBottomColor="muted.300">
            <FlashList
              removeClippedSubviews
              horizontal={true}
              keyboardShouldPersistTaps="always"
              refreshing={loading}
              data={brothers}
              keyExtractor={(item) => item.recordID}
              renderItem={({ item }) => (
                <BrotherItem item={item} handleContact={handleContact} />
              )}
              estimatedItemSize={74}
            />
          </Box>
        )}
        <FlashList
          removeClippedSubviews
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps="always"
          data={filtered}
          keyExtractor={(item) => item.recordID}
          renderItem={({ item }) => (
            <ContactItem item={item} handleContact={handleContact} />
          )}
          estimatedItemSize={64}
        />
      </SearchBarView>
    </ModalView>
  );
};

export default ContactImportDialog;
