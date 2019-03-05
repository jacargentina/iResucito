// @flow
import React, { useContext, useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import { Text, ListItem, Left, Body, Icon } from 'native-base';
import { FlatList, View } from 'react-native';
import { DataContext } from '../../DataContext';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';
import ContactPhoto from './ContactPhoto';

const ContactChooserDialog = (props: any) => {
  const data = useContext(DataContext);
  const { visible, contacts, hide, target } = data.contactChooserDialog;
  const { setList, save } = data.lists;

  const contactSelected = contact => {
    setList(target.listName, target.listKey, contact.givenName);
    save();
    hide();
  };

  return (
    <BaseModal
      visible={visible}
      closeModal={hide}
      title={I18n.t('screen_title.community')}
      fade={true}>
      {contacts.length == 0 && (
        <View
          style={{
            flex: 3,
            justifyContent: 'space-around',
            padding: 10
          }}>
          <Icon
            name="contacts"
            style={{
              fontSize: 120,
              color: commonTheme.brandPrimary,
              alignSelf: 'center'
            }}
          />
          <Text note style={{ textAlign: 'center' }}>
            {I18n.t('ui.community empty')}
          </Text>
        </View>
      )}
      <FlatList
        data={contacts}
        keyExtractor={item => item.recordID}
        renderItem={({ item }) => {
          var contactFullName = `${item.givenName} ${item.familyName}`;
          return (
            <ListItem
              avatar
              button
              onPress={() => {
                contactSelected(item);
              }}>
              <Left>
                <ContactPhoto item={item} />
              </Left>
              <Body>
                <Text>{item.givenName}</Text>
                <Text note>{contactFullName}</Text>
              </Body>
            </ListItem>
          );
        }}
      />
    </BaseModal>
  );
};

export default ContactChooserDialog;
