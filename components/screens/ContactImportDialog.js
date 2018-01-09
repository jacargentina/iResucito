import React from 'react';
import { connect } from 'react-redux';
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
import {
  syncContact,
  hideContactImportDialog,
  saveContacts,
  setContactsFilterText
} from '../actions';
import {
  getCurrentRouteKey,
  getCurrentRouteContactsTextFilter,
  getFilteredContactsForImport
} from '../selectors';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';
import ContactPhoto from './ContactPhoto';

const ContactImportDialog = props => {
  var readyButton = (
    <Text
      style={{
        alignSelf: 'center',
        color: commonTheme.brandPrimary,
        marginRight: 10
      }}
      onPress={() => props.close(props.textFilterId)}>
      {I18n.t('ui.done')}
    </Text>
  );
  return (
    <BaseModal
      visible={props.visible}
      closeModal={() => props.close()}
      closeButton={readyButton}
      title={I18n.t('screen_title.import contacts')}
      fade={true}>
      <SearchBarView
        searchTextFilterId={props.textFilterId}
        searchTextFilter={props.textFilter}
        searchHandler={props.filtrarHandler}>
        {props.imported.length > 0 && (
          <View
            style={{
              padding: 10,
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: commonTheme.listBorderColor
            }}>
            <FlatList
              horizontal={true}
              keyboardShouldPersistTaps="always"
              data={props.imported}
              keyExtractor={item => item.recordID}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={{ marginRight: 10, width: 56 }}
                    onPress={() => props.syncContact(item)}>
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
        {props.items.length === 0 && (
          <Text note style={{ textAlign: 'center', marginTop: 20 }}>
            No hay contactos
          </Text>
        )}
        <FlatList
          onScrollBeginDrag={() => Keyboard.dismiss()}
          keyboardShouldPersistTaps="always"
          data={props.items}
          keyExtractor={item => item.recordID}
          renderItem={({ item }) => {
            var contactFullName = `${item.givenName} ${item.familyName}`;
            return (
              <ListItem
                button
                onPress={() => props.syncContact(item, props.textFilterId)}>
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
                    onPress={() => props.syncContact(item, props.textFilterId)}
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
  var imported = state.ui.get('contacts').toJS();
  return {
    visible: visible,
    imported: imported,
    textFilterId: getCurrentRouteKey(state),
    textFilter: getCurrentRouteContactsTextFilter(state),
    items: getFilteredContactsForImport(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: inputId => {
      dispatch(hideContactImportDialog());
      dispatch(saveContacts());
      dispatch(setContactsFilterText(inputId, ''));
    },
    syncContact: (contact, inputId) => {
      dispatch(syncContact(contact));
      if (inputId) {
        dispatch(setContactsFilterText(inputId, ''));
      }
    },
    filtrarHandler: (inputId, text) => {
      dispatch(setContactsFilterText(inputId, text));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ContactImportDialog
);
