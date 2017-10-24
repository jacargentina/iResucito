import React from 'react';
import { connect } from 'react-redux';
import BaseModal from './BaseModal';
import {
  Text,
  ListItem,
  Thumbnail,
  Left,
  Body,
  Right,
  Switch
} from 'native-base';
import { FlatList, Platform } from 'react-native';
import { importContacts, hideContactImportDialog } from '../actions';

var unknown = require('../../img/avatar.png');

const ContactImportDialog = props => {
  return (
    <BaseModal
      visible={props.visible}
      closeModal={() => props.close()}
      title="Importar Contactos"
      fade={true}>
      <Text note style={{ marginBottom: 20 }}>
        Marca a los hermanos de tu comunidad. Puedes cargarlos previamente en
        los contactos de tu dispositivo.
      </Text>
      <FlatList
        data={props.items}
        keyExtractor={item => item.recordID}
        renderItem={({ item }) => {
          var photo = (
            <Thumbnail
              small
              source={item.hasThumbnail ? { uri: item.thumbnailPath } : unknown}
            />
          );
          var contactFullName =
            Platform.OS == 'ios'
              ? `${item.givenName} ${item.familyName}`
              : item.givenName;
          return (
            <ListItem avatar>
              <Left>{photo}</Left>
              <Body>
                <Text>{contactFullName}</Text>
                <Text note>
                  {item.emailAddresses.length > 0 ? (
                    item.emailAddresses[0].email
                  ) : null}
                </Text>
              </Body>
              <Right>
                <Switch />
              </Right>
            </ListItem>
          );
        }}
      />
    </BaseModal>
  );
};

const mapStateToProps = state => {
  var visible = state.ui.get('contact_import_visible');
  var items = state.ui.get('contact_import_items');
  return {
    visible: visible,
    items: items
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => {
      dispatch(hideContactImportDialog());
    },
    importContacts: selectedContacts => {
      dispatch(importContacts(selectedContacts));
      dispatch(hideContactImportDialog());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ContactImportDialog
);
