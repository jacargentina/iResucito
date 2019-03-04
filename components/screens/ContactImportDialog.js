// @flow
import React, { useContext, useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import SearchBarView from './SearchBarView';
import { Text, ListItem, Body, Right, CheckBox } from 'native-base';
import {
  FlatList,
  View,
  TouchableOpacity,
  Keyboard,
  StyleSheet
} from 'react-native';
import { DataContext } from '../../DataContext';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';
import ContactPhoto from './ContactPhoto';

const ContactImportDialog = (props: any) => {
  const data = useContext(DataContext);

  const [
    visible,
    loading,
    items,
    filter,
    setFilter,
    show,
    hide
  ] = data.contactImportDialog;

  const [imported, , , save] = data.community;

  const close = () => {
    hide();
    save();
    setFilter('');
  };

  const handleContact = contact => {
    handleContact(contact);
    setFilter('');
  };

  var readyButton = (
    <Text
      style={{
        alignSelf: 'center',
        color: commonTheme.brandPrimary,
        marginRight: 10
      }}
      onPress={close}>
      {I18n.t('ui.done')}
    </Text>
  );
  return (
    <BaseModal
      visible={visible}
      closeModal={() => close()}
      closeButton={readyButton}
      title={I18n.t('screen_title.import contacts')}
      fade={true}>
      <SearchBarView value={filter} setValue={setFilter}>
        {imported && imported.length > 0 && (
          <View
            style={{
              padding: 10,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: commonTheme.listBorderColor
            }}>
            <FlatList
              horizontal={true}
              keyboardShouldPersistTaps="always"
              data={imported}
              keyExtractor={item => item.recordID}
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
                        marginTop: 5
                      }}>
                      {item.givenName}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}
        {imported && imported.length === 0 && (
          <Text note style={{ textAlign: 'center', marginTop: 20 }}>
            {I18n.t('ui.no contacts found')}
          </Text>
        )}
        <FlatList
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps="always"
          data={imported}
          keyExtractor={item => item.recordID}
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
    </BaseModal>
  );
};

export default ContactImportDialog;
