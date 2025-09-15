import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
} from 'react';
import { Platform, Alert, View } from 'react-native';
import { Text } from '@gluestack-ui/themed';
import { FlashList } from '@shopify/flash-list';
import {
  useIsFocused,
  useNavigation,
  useScrollToTop,
} from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
  SwipeableRightAction,
  CallToAction,
  SearchBarView,
} from '../components';
import { BrotherContact, useBrothersStore, useSettingsStore } from '../hooks';
import i18n from '@iresucito/translations';
import { contactFilterByText, ordenAlfabetico } from '../util';
import { ContactListItem } from './ContactListItem';
import { StackNavigationProp } from '@react-navigation/stack';
import { ExistingContact } from 'expo-contacts';
import { config } from '../config/gluestack-ui.config';
import { UsersIcon } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { HeaderButton } from '../navigation/util';

const SwipeableRow = (props: { item: BrotherContact }) => {
  const { update, addOrRemove } = useBrothersStore();
  const { item } = props;
  const swipeRef = useRef<Swipeable | null>(null);

  const contactToggleAttibute = useCallback(
    (contact: BrotherContact, attribute: string) => {
      const newValue = !(contact[attribute] === true);
      let updatedContact = Object.assign({}, contact, {
        [attribute]: newValue,
      });
      update(contact.id!, updatedContact);
    },
    [update]
  );

  const contactDelete = useCallback(
    (contact: ExistingContact) => {
      Alert.alert(
        `${i18n.t('ui.delete')} "${contact.name}"`,
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
              color={config.tokens.colors.blue500}
              progress={progress}
              text={i18n.t('ui.psalmist')}
              x={200}
              onPress={() => {
                swipeRef.current?.close();
                contactToggleAttibute(item, 's');
              }}
            />
            <SwipeableRightAction
              color={config.tokens.colors.rose600}
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

export const CommunityScreen = () => {
  const { contacts, deviceContacts_loaded, populateDeviceContacts } =
    useBrothersStore();
  const { computedLocale } = useSettingsStore();
  const isFocused = useIsFocused();
  const navigation = useNavigation<ContactImportNavigationProp>();
  const listRef = useRef<any>(null);
  const [filter, setFilter] = useState('');

  useScrollToTop(listRef);

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
    };
    ensureLoaded();
  }, [navigation, deviceContacts_loaded]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton iconName="PlusIcon" onPress={contactImport} />
      ),
    });
  });

  if (contacts.length === 0 && !filter) {
    return (
      <CallToAction
        icon={UsersIcon}
        title={i18n.t('call_to_action_title.community list')}
        text={i18n.t('call_to_action_text.community list')}
        buttonHandler={contactImport}
        buttonText={i18n.t('call_to_action_button.community list')}
      />
    );
  }

  return (
    <SearchBarView
      value={filter}
      setValue={setFilter}
      placeholder={
        i18n.t('ui.search placeholder', { locale: computedLocale }) + '...'
      }>
      {filtered && filtered.length === 0 && (
        <Text fontSize="$sm" style={{ textAlign: 'center', paddingTop: 20 }}>
          {i18n.t('ui.no contacts found')}
        </Text>
      )}
      <FlashList
        ref={listRef}
        data={filtered}
        extraData={{ locale: i18n.locale, contacts }}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }) => <SwipeableRow item={item} />}
      />
    </SearchBarView>
  );
};
