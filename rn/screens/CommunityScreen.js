// @flow
import * as React from 'react';
import {
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Platform, Alert, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FlatList, Text, Icon, useTheme } from 'native-base';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SwipeableRightAction from '../components/SwipeableRightAction';
import SearchBarView from '../components/SearchBarView';
import { DataContext } from '../DataContext';
import CallToAction from '../components/CallToAction';
import I18n from '../../translations';
import useStackNavOptions from '../navigation/useStackNavOptions';
import { contactFilterByText, ordenAlfabetico } from '../util';
import ContactListItem from './ContactListItem';

const SwipeableRow = (props: { item: any }): React.Node => {
  const data = useContext(DataContext);
  const { colors } = useTheme();
  const { brothers, update, remove, add } = data.community;
  const { item } = props;
  const swipeRef = useRef<typeof Swipeable>();

  const contactToggleAttibute = useCallback(
    (contact, attribute) => {
      const newValue = !(contact[attribute] === true);
      let updatedContact = Object.assign({}, contact, {
        [attribute]: newValue,
      });
      update(contact.recordID, updatedContact);
    },
    [update]
  );

  const addOrRemove = useCallback(
    (contact) => {
      let i = brothers.findIndex((c) => c.recordID === contact.recordID);
      // Ya esta importado
      if (i !== -1) {
        remove(brothers[i]);
      } else {
        add(contact);
      }
    },
    [add, remove, brothers]
  );

  const contactDelete = useCallback(
    (contact) => {
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
    },
    [addOrRemove]
  );

  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      rightThreshold={30}
      renderRightActions={(progress, dragX) => {
        return (
          <View style={{ width: 200, flexDirection: 'row' }}>
            <SwipeableRightAction
              color={colors.blue['500']}
              progress={progress}
              text={I18n.t('ui.psalmist')}
              x={200}
              onPress={() => {
                swipeRef.current.close();
                contactToggleAttibute(item, 's');
              }}
            />
            <SwipeableRightAction
              color={colors.rose['600']}
              progress={progress}
              text={I18n.t('ui.delete')}
              x={100}
              onPress={() => {
                swipeRef.current.close();
                contactDelete(item);
              }}
            />
          </View>
        );
      }}>
      <ContactListItem item={item} />
    </Swipeable>
  );
};

const CommunityScreen = (props: any): React.Node => {
  const data = useContext(DataContext);
  const options = useStackNavOptions();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { brothers, deviceContacts, populateDeviceContacts } = data.community;
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

  const contactImport = useCallback(() => {
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
  }, [navigation, deviceContacts, populateDeviceContacts]);

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
        renderItem={({ item }) => <SwipeableRow item={item} />}
      />
    </SearchBarView>
  );
};

export default CommunityScreen;
