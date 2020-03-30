// @flow
import React, { useContext, useState, useEffect, useMemo } from 'react';
import ModalView from './ModalView';
import SearchBarView from './SearchBarView';
import { Text, ListItem, Body, Right, CheckBox, Button } from 'native-base';
import {
  FlatList,
  View,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DataContext } from '../DataContext';
import commonTheme from '../native-base-theme/variables/platform';
import I18n from '../../translations';
import ContactPhoto from './ContactPhoto';
import {
  getContactsForImport,
  contactFilterByText,
  ordenAlfabetico,
} from '../util';

const ContactImportDialog = () => {
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const { brothers, deviceContacts, addOrRemove } = data.community;
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (deviceContacts) {
      var withName = deviceContacts.filter(
        (c) => c.givenName.length > 0 || c.familyName.length > 0
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

  const close = () => {
    setFilter('');
    navigation.goBack(null);
  };

  const handleContact = (contact) => {
    addOrRemove(contact);
    setFilter('');
  };

  return (
    <ModalView
      right={
        <Button
          rounded
          small
          style={{
            alignSelf: 'flex-end',
            color: commonTheme.brandPrimary,
            marginRight: 10,
          }}
          onPress={close}>
          <Text>{I18n.t('ui.done')}</Text>
        </Button>
      }
      left={
        <Text
          style={{
            alignSelf: 'flex-start',
            marginLeft: 10,
            fontSize: commonTheme.fontSizeBase + 3,
            fontWeight: 'bold',
          }}>
          {I18n.t('screen_title.import contacts')}
        </Text>
      }>
      <SearchBarView value={filter} setValue={setFilter}>
        {brothers && brothers.length > 0 && (
          <View
            style={{
              padding: 10,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: commonTheme.listBorderColor,
            }}>
            <FlatList
              horizontal={true}
              keyboardShouldPersistTaps="always"
              refreshing={loading}
              data={brothers}
              keyExtractor={(item) => item.recordID}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={{ marginRight: 10, width: 56 }}
                    onPress={() => handleContact(item)}>
                    <ContactPhoto item={item} />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 12,
                        textAlign: 'center',
                        marginTop: 5,
                      }}>
                      {item.givenName}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
        <FlatList
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps="always"
          data={filtered}
          keyExtractor={(item) => item.recordID}
          renderItem={({ item }) => {
            var contactFullName = item.givenName;
            if (item.familyName) {
              contactFullName += ` ${item.familyName}`;
            }
            return (
              <ListItem button onPress={() => handleContact(item)}>
                <ContactPhoto item={item} />
                <Body>
                  <Text
                    style={{ fontSize: 17, fontWeight: 'bold' }}
                    numberOfLines={1}>
                    {contactFullName}
                  </Text>
                  <Text note numberOfLines={1}>
                    {item.emailAddresses.length > 0
                      ? item.emailAddresses[0].email
                      : null}
                  </Text>
                </Body>
                <Right>
                  <CheckBox
                    style={{ marginRight: 15 }}
                    checked={item.imported}
                    onPress={() => handleContact(item)}
                  />
                </Right>
              </ListItem>
            );
          }}
        />
      </SearchBarView>
    </ModalView>
  );
};

export default ContactImportDialog;
