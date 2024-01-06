import type { RouteProp } from '@react-navigation/native';
import Contacts from 'expo-contacts';
import { useState, useMemo } from 'react';
import { Text, Icon } from '@gluestack-ui/themed';
import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ModalView, SearchBarView } from '../components';
import { useBrothersStore, useListsStore, useSettingsStore } from '../hooks';
import i18n from '@iresucito/translations';
import { contactFilterByText, ordenAlfabetico } from '../util';
import { ContactListItem } from './ContactListItem';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { UsersIcon } from 'lucide-react-native';

type ContactChooserRouteProp = RouteProp<RootStackParamList, 'ContactChooser'>;

export const ContactChooserDialog = () => {
  const navigation = useNavigation();
  const route = useRoute<ContactChooserRouteProp>();
  const { contacts } = useBrothersStore();
  const { computedLocale } = useSettingsStore();
  const [filter, setFilter] = useState('');
  const { target } = route.params;

  const filtered = useMemo(() => {
    var result = contacts.filter((c) => contactFilterByText(c, filter));
    result.sort(ordenAlfabetico);
    return result;
  }, [contacts, filter]);

  const contactSelected = (contact: Contacts.Contact) => {
    useListsStore
      .getState()
      .setList(target.listName, target.listKey, contact.name);
    navigation.goBack();
  };

  return (
    <ModalView
      left={
        <Text
          fontWeight="bold"
          fontSize="$md"
          mt="$2"
          ml="$4"
          style={{
            alignSelf: 'flex-start',
          }}>
          {i18n.t('screen_title.community')}
        </Text>
      }
      closeText={i18n.t('ui.done')}
      closeHandler={() => setFilter('')}>
      {contacts.length === 0 && (
        <View
          style={{
            flex: 3,
            justifyContent: 'space-around',
            padding: 10,
          }}>
          <Icon as={UsersIcon} size="xxl" alignSelf="center" />
          <Text textAlign="center">{i18n.t('ui.community empty')}</Text>
        </View>
      )}
      {contacts.length > 0 && (
        <SearchBarView
          value={filter}
          setValue={setFilter}
          placeholder={
            i18n.t('ui.search placeholder', { locale: computedLocale }) + '...'
          }>
          <FlashList
            data={filtered}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <ContactListItem
                  item={item}
                  onPress={() => {
                    contactSelected(item);
                  }}
                />
              );
            }}
            estimatedItemSize={84}
          />
        </SearchBarView>
      )}
    </ModalView>
  );
};
