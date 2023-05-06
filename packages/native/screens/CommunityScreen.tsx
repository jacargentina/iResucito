import * as React from 'react';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Platform, Alert, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Icon, useTheme } from 'native-base';
import { FlashList } from '@shopify/flash-list';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SwipeableRightAction from '../components/SwipeableRightAction';
import SearchBarView from '../components/SearchBarView';
import { useBrothersStore, useSettingsStore } from '../hooks';
import CallToAction from '../components/CallToAction';
import i18n from '@iresucito/translations';
import useStackNavOptions from '../navigation/StackNavOptions';
import { contactFilterByText, ordenAlfabetico } from '../util';
import ContactListItem from './ContactListItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { Contact } from 'react-native-contacts';

const SwipeableRow = (props: { item: any }) => {
  const { contacts, update, addOrRemove } = useBrothersStore();
  const { colors } = useTheme();
  const { item } = props;
  const swipeRef = useRef<Swipeable | null>(null);

  const contactToggleAttibute = useCallback(
    (contact: any, attribute: string) => {
      const newValue = !(contact[attribute] === true);
      let updatedContact = Object.assign({}, contact, {
        [attribute]: newValue,
      });
      update(contact.recordID, updatedContact);
    },
    [update]
  );

  const contactDelete = useCallback(
    (contact: Contact) => {
      Alert.alert(
        `${i18n.t('ui.delete')} "${contact.givenName}"`,
        i18n.t('ui.delete confirmation'),
        [
          {
            text: i18n.t('ui.delete'),
            onPress: () => {
              addOrRemove(contact);
            },
            style: 'destructive',
          },
          {
            text: i18n.t('ui.cancel'),
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
              text={i18n.t('ui.psalmist')}
              x={200}
              onPress={() => {
                swipeRef.current?.close();
                contactToggleAttibute(item, 's');
              }}
            />
            <SwipeableRightAction
              color={colors.rose['600']}
              progress={progress}
              text={i18n.t('ui.delete')}
              x={100}
              onPress={() => {
                swipeRef.current?.close();
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

type ContactImportNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ContactImport'
>;

const CommunityScreen = () => {
  const { contacts, deviceContacts_loaded, populateDeviceContacts } = useBrothersStore();
  const { computedLocale } = useSettingsStore();
  const options = useStackNavOptions();
  const isFocused = useIsFocused();
  const navigation = useNavigation<ContactImportNavigationProp>();
  const listRef = useRef<any>();
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    if (contacts) {
      var result = contacts.filter((c) => contactFilterByText(c, filter));
      result.sort(ordenAlfabetico);
      return result;
    }
    return [];
  }, [contacts, filter]);

  useEffect(() => {
    if (filtered.length > 0 && isFocused) {
      setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: 0,
          animated: true,
          viewOffset: 0,
          viewPosition: 1,
        });
      }, 50);
    }
  }, [isFocused, filtered.length]);

  const contactImport = useCallback(() => {
    const ensureLoaded = async () => {
      try {
        if (!deviceContacts_loaded) {
          await populateDeviceContacts(true);
        }
        navigation.navigate('ContactImport');
      } catch {
        let message = i18n.t('alert_message.contacts permission');
        if (Platform.OS === 'ios') {
          message += '\n\n' + i18n.t('alert_message.contacts permission ios');
        }
        Alert.alert(i18n.t('alert_title.contacts permission'), message);
      }
    }
    ensureLoaded();
  }, [navigation, deviceContacts_loaded]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          as={Ionicons}
          name="add"
          size="xl"
          style={{
            marginTop: 4,
            marginRight: 8,
          }}
          color={options.headerTitleStyle.color}
          onPress={contactImport}
        />
      ),
    });
  });

  if (contacts.length === 0 && !filter) {
    return (
      <CallToAction
        icon="people-outline"
        title={i18n.t('call_to_action_title.community list')}
        text={i18n.t('call_to_action_text.community list')}
        buttonHandler={contactImport}
        buttonText={i18n.t('call_to_action_button.community list')}
      />
    );
  }

  return (
    <SearchBarView value={filter} setValue={setFilter} placeholder={i18n.t("ui.search placeholder", { locale: computedLocale }) + '...'}>
      {filtered && filtered.length === 0 && (
        <Text fontSize="sm" style={{ textAlign: 'center', paddingTop: 20 }}>
          {i18n.t('ui.no contacts found')}
        </Text>
      )}
      <FlashList
        ref={listRef}
        data={filtered}
        extraData={{ locale: i18n.locale, contacts }}
        keyExtractor={(item: any) => item.recordID}
        renderItem={({ item }) => <SwipeableRow item={item} />}
        estimatedItemSize={90}
      />
    </SearchBarView>
  );
};

export default CommunityScreen;
