// @flow
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ListItem, Right, Body, Icon, Text, Fab } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { Alert, FlatList, View } from 'react-native';
import SearchBarView from './SearchBarView';
import { DataContext } from '../DataContext';
import CallToAction from './CallToAction';
import commonTheme from '../native-base-theme/variables/platform';
import I18n from '../translations';
import ContactPhoto from './ContactPhoto';
import { contactFilterByText, ordenAlfabetico } from '../util';

const CommunityScreen = (props: any) => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const { brothers, update, remove, add } = data.community;
  const [filtered, setFiltered] = useState();
  const listRef = useRef();
  const [filter, setFilter] = useState('');

  useEffect(() => {
    var result = [...brothers];
    if (filter !== '') {
      result = result.filter(c => contactFilterByText(c, filter));
    }
    result.sort(ordenAlfabetico);
    setFiltered(result);
  }, [brothers, filter]);

  const addOrRemove = contact => {
    var i = brothers.findIndex(c => c.recordID == contact.recordID);
    // Ya esta importado
    if (i !== -1) {
      var item = brothers[i];
      remove(item);
    } else {
      add(contact);
    }
  };
  useEffect(() => {
    if (filtered) {
      if (filtered.length > 0) {
        if (listRef.current) {
          setTimeout(() => {
            listRef.current.scrollToIndex({
              index: 0,
              animated: true,
              viewOffset: 0,
              viewPosition: 1
            });
          }, 50);
        }
      }
    }
  }, [filtered]);

  const contactDelete = contact => {
    Alert.alert(
      `${I18n.t('ui.delete')} "${contact.givenName}"`,
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          onPress: () => {
            addOrRemove(contact);
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
    const newValue = !(contact[attribute] === true);
    var updatedContact = Object.assign({}, contact, { [attribute]: newValue });
    update(contact.recordID, updatedContact);
  };

  const contactImport = () => {
    navigation.navigate('ContactImport');
  };

  if (brothers.length == 0 && !filter)
    return (
      <CallToAction
        icon="people"
        title={I18n.t('call_to_action_title.community list')}
        text={I18n.t('call_to_action_text.community list')}
        buttonHandler={() => navigation.navigate('ContactImport')}
        buttonText={I18n.t('call_to_action_button.community list')}
      />
    );

  return (
    <SearchBarView value={filter} setValue={setFilter}>
      {filtered && filtered.length == 0 && (
        <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
          {I18n.t('ui.no contacts found')}
        </Text>
      )}
      <FlatList
        ref={listRef}
        data={filtered}
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
      <Fab
        containerStyle={{}}
        style={{ backgroundColor: commonTheme.brandPrimary }}
        position="bottomRight"
        onPress={contactImport}>
        <Icon name="add" />
      </Fab>
    </SearchBarView>
  );
};

export default CommunityScreen;
