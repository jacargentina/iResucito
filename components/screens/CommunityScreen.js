import React from 'react';
import { connect } from 'react-redux';
import {
  ListItem,
  Right,
  Body,
  Icon,
  Text,
  Thumbnail
} from 'native-base';
import Swipeout from 'react-native-swipeout';
import { Alert, FlatList, Platform, View } from 'react-native';
import SearchBarView from './SearchBarView';
import {
  showContactImportDialog,
  syncContact,
  setContactAttribute,
  setContactsFilterText
} from '../actions';
import AppNavigatorConfig from '../AppNavigatorConfig';
import BaseCallToAction from './BaseCallToAction';
import {
  getCurrentRouteKey,
  getCurrentRouteContactsTextFilter,
  getProcessedContacts
} from '../selectors';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../../i18n';

const unknown = require('../../img/avatar.png');

const CommunityScreen = props => {
  if (props.items.length == 0)
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
      <FlatList
        data={props.items}
        keyExtractor={item => item.recordID}
        renderItem={({ item }) => {
          var contactFullName =
            Platform.OS == 'ios'
              ? `${item.givenName} ${item.familyName}`
              : item.givenName;

          var flags = (
            <View style={{ flexDirection: 'row' }}>
              {item.s === true && (
                <Icon
                  name="musical-notes"
                  style={{ marginRight: 4, color: commonTheme.brandPrimary, fontSize: 28 }}
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
                <Thumbnail
                  source={
                    item.hasThumbnail ? { uri: item.thumbnailPath } : unknown
                  }
                />
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

const mapStateToProps = state => {
  return {
    textFilterId: getCurrentRouteKey(state),
    textFilter: getCurrentRouteContactsTextFilter(state),
    items: getProcessedContacts(state)
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
            onPress: () => dispatch(syncContact(contact, false)),
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
        color: AppNavigatorConfig.navigationOptions.headerTitleStyle.color
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
