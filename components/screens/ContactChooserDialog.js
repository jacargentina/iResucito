// @flow
import React from 'react';
import { connect } from 'react-redux';
import BaseModal from './BaseModal';
import { Text, ListItem, Left, Body, Icon } from 'native-base';
import { FlatList, View } from 'react-native';
import { addContactToList, saveLists, closeChooserDialog } from '../actions';
import { getProcessedContacts } from '../selectors';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';
import ContactPhoto from './ContactPhoto';

const ContactChooserDialog = (props: any) => {
  return (
    <BaseModal
      visible={props.visible}
      closeModal={() => props.close()}
      title={I18n.t('screen_title.community')}
      fade={true}>
      {props.items.length == 0 && (
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
        data={props.items}
        keyExtractor={item => item.recordID}
        renderItem={({ item }) => {
          var contactFullName = `${item.givenName} ${item.familyName}`;
          return (
            <ListItem
              avatar
              button
              onPress={() => {
                props.contactSelected(item, props.listName, props.listKey);
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

const mapStateToProps = (state, props) => {
  var chooser = state.ui.get('chooser');
  var chooser_target_list = state.ui.get('chooser_target_list');
  var chooser_target_key = state.ui.get('chooser_target_key');
  return {
    listName: chooser_target_list,
    listKey: chooser_target_key,
    visible: chooser === 'Contact',
    items: getProcessedContacts(state, props)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    close: () => {
      dispatch(closeChooserDialog());
    },
    contactSelected: (contact, list, key) => {
      dispatch(addContactToList(contact, list, key));
      dispatch(saveLists());
      dispatch(closeChooserDialog());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  ContactChooserDialog
);
