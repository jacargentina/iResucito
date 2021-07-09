// @flow
import * as React from 'react';
import { useContext, useEffect, useRef, useState, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlatList, Text, Icon } from 'native-base';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Swipeout from 'react-native-swipeout';
import SearchBarView from '../components/SearchBarView';
import { DataContext } from '../DataContext';
import CallToAction from '../components/CallToAction';
import I18n from '../../translations';
import useStackNavOptions from '../navigation/useStackNavOptions';
import { contactFilterByText, ordenAlfabetico } from '../util';
import ContactListItem from './ContactListItem';

const CommunityScreen = (props: any): React.Node => {
  const data = useContext(DataContext);
  const options = useStackNavOptions();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {
    brothers,
    deviceContacts,
    populateDeviceContacts,
    update,
    remove,
    add,
  } = data.community;
  const listRef = useRef<any>();
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
  }, [isFocused, filtered.length]);

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

  const contactImport = () => {
    const promise = !deviceContacts
      ? populateDeviceContacts()
      : Promise.resolve();

    promise
      .then(() => {
        navigation.navigate('ContactImport');
      })
      .catch(() => {
        let message = I18n.t('alert_message.contacts permission');
        if (Platform.OS === 'ios') {
          message += '\n\n' + I18n.t('alert_message.contacts permission ios');
        }
        Alert.alert(I18n.t('alert_title.contacts permission'), message);
      });
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          as={Ionicons}
          name="add"
          size="md"
          style={{
            marginTop: 4,
            marginRight: 8,
            color: options.headerTitleStyle.color,
          }}
          onPress={contactImport}
        />
      ),
    });
  });

  if (brothers.length === 0 && !filter) {
    return (
      <CallToAction
        icon="people-outline"
        title={I18n.t('call_to_action_title.community list')}
        text={I18n.t('call_to_action_text.community list')}
        buttonHandler={contactImport}
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
