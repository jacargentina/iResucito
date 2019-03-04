// @flow
import React, { useContext, useState, useEffect } from 'react';
import { ListItem, Right, Body, Icon, Text } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { Alert, FlatList, View } from 'react-native';
import SearchBarView from './SearchBarView';
import { DataContext } from '../../DataContext';
import AppNavigatorOptions from '../AppNavigatorOptions';
import BaseCallToAction from './BaseCallToAction';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';
import ContactPhoto from './ContactPhoto';

const CommunityScreen = (props: any) => {
  const data = useContext(DataContext);
  const { brothers, filter, setFilter, save, addOrRemove } = data.community;

  const contactDelete = contact => {
    Alert.alert(
      `${I18n.t('ui.delete')} "${contact.givenName}"`,
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          onPress: () => {
            addOrRemove(contact);
            save();
          },
          style: 'destructive'
        },
        {
          text: I18n.t('ui.cancel'),
          style: 'cancel'
        }
      ]
    );
  };

  const contactToggleAttibute = (contact, attribute) => {
    // TODO
    //dispatch(setContactAttribute(contact, attribute));
    save();
  };

  if (brothers.length == 0 && !props.textFilter)
    return (
      <BaseCallToAction
        icon="people"
        title={I18n.t('call_to_action_title.community list')}
        text={I18n.t('call_to_action_text.community list')}
        buttonHandler={data.contactImportDialog.show}
        buttonText={I18n.t('call_to_action_button.community list')}
      />
    );
  return (
    <SearchBarView value={filter} setValue={setFilter}>
      {brothers.length == 0 && (
        <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
          {I18n.t('ui.no contacts found')}
        </Text>
      )}
      <FlatList
        data={brothers}
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
                contactToggleAttibute(item, 's');
              }
            },
            {
              text: I18n.t('ui.delete'),
              type: 'delete',
              onPress: () => {
                contactDelete(item);
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

const ImportContactsButton = props => {
  const data = useContext(DataContext);
  const { show } = data.contactImportDialog;
  return (
    <Icon
      name="refresh"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: AppNavigatorOptions.headerTitleStyle.color
      }}
      onPress={show}
    />
  );
};

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

export default CommunityScreen;
