// @flow
import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Right, Body, Icon, Text } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { Alert, FlatList, View } from 'react-native';
import SearchBarView from './SearchBarView';
import {
  showContactImportDialog,
  syncContact,
  saveContacts,
  setContactAttribute,
  setContactsFilterText
} from '../actions';
import AppNavigatorOptions from '../AppNavigatorOptions';
import BaseCallToAction from './BaseCallToAction';
import {
  getCurrentRouteKey,
  getCurrentRouteContactsTextFilter,
  getProcessedContacts
} from '../selectors';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';
import ContactPhoto from './ContactPhoto';

const CommunityScreen = (props: any) => {
  if (props.items.length == 0 && !props.textFilter)
    return (
      <BaseCallToAction
        icon="people"
        title={I18n.t('call_to_action_title.community list')}
        text={I18n.t('call_to_action_text.community list')}
        buttonHandler={() => props.contactImport()}
        buttonText={I18n.t('call_to_action_button.community list')}
      />
    );
  return (
    <SearchBarView
      searchTextFilterId={props.textFilterId}
      searchTextFilter={props.textFilter}
      searchHandler={props.filtrarHandler}>
      {props.items.length == 0 && (
        <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
          {I18n.t('ui.no contacts found')}
        </Text>
      )}
      <FlatList
        data={props.items}
        keyExtractor={item => item.recordID}
        renderItem={({ item }) => {
          var contactFullName = `${item.givenName} ${item.familyName}`;
          var flags = (
            <View style={{ flexDirection: 'row' }}>
              {item.s === true && (
                <Icon
                  name="musical-notes"
                  style={{
                    marginRight: 4,
                    color: commonTheme.brandPrimary,
                    fontSize: 28
                  }}
                />
              )}
            </View>
          );
          var swipeoutBtns = [
            {
              text: I18n.t('ui.psalmist'),
              type: 'primary',
              onPress: () => {
                props.contactToggleAttibute(item, 's');
              }
            },
            {
              text: I18n.t('ui.delete'),
              type: 'delete',
              onPress: () => {
                props.contactDelete(item);
              }
            }
          ];
          return (
            <Swipeout
              right={swipeoutBtns}
              backgroundColor="white"
              autoClose={true}>
              <ListItem>
                <ContactPhoto item={item} />
                <Body>
                  <Text>{item.givenName}</Text>
                  <Text note>{contactFullName}</Text>
                </Body>
                <Right>{flags}</Right>
              </ListItem>
            </Swipeout>
          );
        }}
      />
    </SearchBarView>
  );
};

const mapStateToProps = (state, props) => {
  return {
    textFilterId: getCurrentRouteKey(state, props),
    textFilter: getCurrentRouteContactsTextFilter(state, props),
    items: getProcessedContacts(state, props)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    filtrarHandler: (inputId, text) => {
      dispatch(setContactsFilterText(inputId, text));
    },
    contactDelete: contact => {
      Alert.alert(
        `${I18n.t('ui.delete')} "${contact.givenName}"`,
        I18n.t('ui.delete confirmation'),
        [
          {
            text: I18n.t('ui.delete'),
            onPress: () => {
              dispatch(syncContact(contact));
              dispatch(saveContacts());
            },
            style: 'destructive'
          },
          {
            text: I18n.t('ui.cancel'),
            style: 'cancel'
          }
        ]
      );
    },
    contactImport: () => {
      dispatch(showContactImportDialog());
    },
    contactToggleAttibute: (contact, attribute) => {
      dispatch(setContactAttribute(contact, attribute));
      dispatch(saveContacts());
    }
  };
};

/* eslint-disable no-unused-vars */
const ImportContacts = props => {
  return (
    <Icon
      name="sync"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: AppNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => props.contactImport()}
    />
  );
};

const ImportContactsButton = connect(mapStateToProps, mapDispatchToProps)(
  ImportContacts
);

CommunityScreen.navigationOptions = props => ({
  title: I18n.t('screen_title.community'),
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="contacts"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  },
  headerRight: <ImportContactsButton />
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityScreen);
