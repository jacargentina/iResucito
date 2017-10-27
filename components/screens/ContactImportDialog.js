import React from 'react';
import { connect } from 'react-redux';
import BaseModal from './BaseModal';
import SearchBarView from './SearchBarView';
import {
  Text,
  ListItem,
  Thumbnail,
  Left,
  Body,
  Right,
  CheckBox
} from 'native-base';
import { FlatList, Platform } from 'react-native';
import {
  syncContact,
  hideContactImportDialog,
  setContactsFilterText
} from '../actions';
import {
  getCurrentRouteKey,
  getCurrentRouteContactsTextFilter,
  getFilteredContactsForImport
} from '../selectors';
import commonTheme from '../../native-base-theme/variables/platform';

const unknown = require('../../img/avatar.png');

const ContactImportDialog = props => {
  var readyButton = (
    <Text
      style={{
        alignSelf: 'center',
        color: commonTheme.brandPrimary
      }}
      onPress={() => props.close()}>
      Listo
    </Text>
  );
  return (
    <BaseModal
      visible={props.visible}
      closeModal={() => props.close()}
      closeButton={readyButton}
      title="Importar Contactos"
      fade={true}>
      <SearchBarView
        searchTextFilterId={props.textFilterId}
        searchTexFilter={props.textFilter}
        searchHandler={props.filtrarHandler}>
        <FlatList
          data={props.items}
          keyExtractor={item => item.recordID}
          renderItem={({ item }) => {
            var photo = (
              <Thumbnail
                small
                source={
                  item.hasThumbnail ? { uri: item.thumbnailPath } : unknown
                }
              />
            );
            var contactFullName =
              Platform.OS == 'ios'
                ? `${item.givenName} ${item.familyName}`
                : item.givenName;
            return (
              <ListItem avatar button onPress={() => props.syncContact(item)}>
                <Left>{photo}</Left>
                <Body>
                  <Text
                    style={{ fontSize: 15, fontWeight: 'bold' }}
                    numberOfLines={1}>
                    {contactFullName}
                  </Text>
                  <Text note numberOfLines={1}>
                    {item.emailAddresses.length > 0 ? (
                      item.emailAddresses[0].email
                    ) : null}
                  </Text>
                </Body>
                <Right>
                  <CheckBox
                    checked={item.imported}
                    onPress={() => props.syncContact(item)}
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

const mapStateToProps = state => {
  var visible = state.ui.get('contact_import_visible');
  return {
    visible: visible,
    textFilterId: getCurrentRouteKey(state),
    textFilter: getCurrentRouteContactsTextFilter(state),
    items: getFilteredContactsForImport(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => {
      dispatch(hideContactImportDialog());
    },
    syncContact: (contact, isImported) => {
      dispatch(syncContact(contact, isImported));
    },
    filtrarHandler: (inputId, text) => {
      dispatch(setContactsFilterText(inputId, text));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ContactImportDialog
);
