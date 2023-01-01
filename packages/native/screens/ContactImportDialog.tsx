import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import {
  Text,
  Box,
  Pressable,
  HStack,
  VStack,
  Switch,
  FlatList,
} from 'native-base';
import { Keyboard, StyleSheet } from 'react-native';
import ModalView from '../components/ModalView';
import SearchBarView from '../components/SearchBarView';
import ContactPhoto from '../components/ContactPhoto';
import { BrotherContact, useData } from '../DataContext';
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
          {item.givenName}
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
      contactFullName += ` ${item.familyName}`;
    }
    return (
      <Pressable onPress={() => handleContact(item)}>
        <HStack p="2" justifyContent="space-between" alignItems="center">
          <ContactPhoto item={item} />
          <VStack w="60%">
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
  const data = useData();
  const { brothers, deviceContacts, addOrRemove } = data.community;
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<ContactForImport[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (deviceContacts) {
      var withName = deviceContacts.filter(
        (c) =>
          (c.givenName && c.givenName.length > 0) ||
          (c.familyName && c.familyName.length > 0)
      );
      var result = getContactsForImport(withName, brothers);
      setContacts(result);
      setLoading(false);
    }
  }, [deviceContacts, brothers]);

  const filtered = useMemo(() => {
    var result = contacts.filter((c) => contactFilterByText(c, filter));
    result.sort(ordenAlfabetico);
    return result;
  }, [contacts, filter]);

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
      <SearchBarView value={filter} setValue={setFilter}>
        {brothers && brothers.length > 0 && (
          <Box
            p="4"
            borderBottomWidth={StyleSheet.hairlineWidth}
            borderBottomColor="muted.300">
            <FlatList
              removeClippedSubviews
              horizontal={true}
              keyboardShouldPersistTaps="always"
              refreshing={loading}
              data={brothers}
              keyExtractor={(item) => item.recordID}
              renderItem={({ item }) => (
                <BrotherItem item={item} handleContact={handleContact} />
              )}
            />
          </Box>
        )}
        <FlatList
          removeClippedSubviews
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps="always"
          data={filtered}
          keyExtractor={(item) => item.recordID}
          renderItem={({ item }) => (
            <ContactItem item={item} handleContact={handleContact} />
          )}
        />
      </SearchBarView>
    </ModalView>
  );
};

export default ContactImportDialog;
