import React from 'react';
import { connect } from 'react-redux';
import BaseModal from './BaseModal';
import { Text, ListItem, Thumbnail, Left, Body, Right } from 'native-base';
import Switch from '../widgets/switch';
import { FlatList, Platform } from 'react-native';
import { syncContact, hideContactImportDialog } from '../actions';
import { getProcessedContactsForImport } from '../selectors';

const unknown = require('../../img/avatar.png');

const ContactImportDialog = props => {
  return (
    <BaseModal
      visible={props.visible}
      closeModal={() => props.close()}
      title="Importar Contactos">
      {props.items.length == 0 && (
        <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
          Ningún contacto encontrado
        </Text>
      )}
      {props.items.length > 0 && (
        <Text note style={{ textAlign: 'center', marginBottom: 20 }}>
          Marca a los hermanos de tu comunidad. Puedes cargarlos previamente en
          los contactos de tu dispositivo.
        </Text>
      )}
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
                <Switch
                  value={item.imported}
                  onValueChange={checked => props.syncContact(item, checked)}
                />
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
  return {
    visible: visible,
    items: getProcessedContactsForImport(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => {
      dispatch(hideContactImportDialog());
    },
    syncContact: (contact, isImported) => {
      dispatch(syncContact(contact, isImported));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ContactImportDialog
);
