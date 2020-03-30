// @flow
import React, { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { Alert, FlatList } from 'react-native';
import { Text } from 'native-base';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Swipeout from 'react-native-swipeout';
import SearchBarView from './SearchBarView';
import { DataContext } from '../DataContext';
import CallToAction from './CallToAction';
import I18n from '../../translations';
import ContactListItem from './ContactListItem';
import { contactFilterByText, ordenAlfabetico } from '../util';

const CommunityScreen = (props: any) => {
  const data = useContext(DataContext);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { contactImport, brothers, update, remove, add } = data.community;
  const listRef = useRef<?FlatList>();
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (brothers) {
      var result = brothers.filter((c) => contactFilterByText(c, filter));
      result.sort(ordenAlfabetico);
      return result;
    }
    return [];
  }, [brothers, filter]);

  useEffect(() => {
    if (filtered.length > 0 && isFocused) {
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollToIndex({
            index: 0,
            animated: true,
            viewOffset: 0,
            viewPosition: 1,
          });
        }
      }, 50);
    }
  }, [filtered.length]);

  const addOrRemove = (contact) => {
    var i = brothers.findIndex((c) => c.recordID === contact.recordID);
    // Ya esta importado
    if (i !== -1) {
      var item = brothers[i];
      remove(item);
    } else {
      add(contact);
    }
  };

  const contactDelete = (contact) => {
    Alert.alert(
      `${I18n.t('ui.delete')} "${contact.givenName}"`,
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          onPress: () => {
            addOrRemove(contact);
          },
          style: 'destructive',
        },
        {
          text: I18n.t('ui.cancel'),
          style: 'cancel',
        },
      ]
    );
  };

  const contactToggleAttibute = (contact, attribute) => {
    const newValue = !(contact[attribute] === true);
    var updatedContact = Object.assign({}, contact, { [attribute]: newValue });
    update(contact.recordID, updatedContact);
  };

  if (brothers.length === 0 && !filter) {
    return (
      <CallToAction
        icon="people"
        title={I18n.t('call_to_action_title.community list')}
        text={I18n.t('call_to_action_text.community list')}
        buttonHandler={() => contactImport(navigation)}
        buttonText={I18n.t('call_to_action_button.community list')}
      />
    );
  }

  return (
    <SearchBarView value={filter} setValue={setFilter}>
      {filtered && filtered.length === 0 && (
        <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
          {I18n.t('ui.no contacts found')}
        </Text>
      )}
      <FlatList
        ref={listRef}
        data={filtered}
        extraData={{ locale: I18n.locale, brothers }}
        keyExtractor={(item) => item.recordID}
        renderItem={({ item }) => {
          var swipeoutBtns = [
            {
              text: I18n.t('ui.psalmist'),
              type: 'primary',
              onPress: () => {
                contactToggleAttibute(item, 's');
              },
            },
            {
              text: I18n.t('ui.delete'),
              type: 'delete',
              onPress: () => {
                contactDelete(item);
              },
            },
          ];
          return (
            <Swipeout
              right={swipeoutBtns}
              backgroundColor="white"
              autoClose={true}>
              <ContactListItem item={item} />
            </Swipeout>
          );
        }}
      />
    </SearchBarView>
  );
};

export default CommunityScreen;
