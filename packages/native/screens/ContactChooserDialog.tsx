import * as React from 'react';
import type { RouteProp } from '@react-navigation/native';
import Contacts from 'react-native-contacts';
import { useState, useMemo } from 'react';
import { Text, Icon } from 'native-base';
import { FlashList } from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ModalView from '../components/ModalView';
import { useLists, useCommunity } from '../hooks';
import i18n from '@iresucito/translations';
import { contactFilterByText, ordenAlfabetico } from '../util';
import SearchBarView from '../components/SearchBarView';
import ContactListItem from './ContactListItem';

import type { RootStackParamList } from '../navigation/RootNavigator';

type ContactChooserRouteProp = RouteProp<RootStackParamList, 'ContactChooser'>;

const ContactChooserDialog = () => {
  const navigation = useNavigation();
  const route = useRoute<ContactChooserRouteProp>();
  const { setList } = useLists();
  const { brothers } = useCommunity();
  const [filter, setFilter] = useState('');
  const { target } = route.params;

  const filtered = useMemo(() => {
    var result = brothers.filter((c) => contactFilterByText(c, filter));
    result.sort(ordenAlfabetico);
    return result;
  }, [brothers, filter]);

  const contactSelected = (contact: Contacts.Contact) => {
    setList(target.listName, target.listKey, contact.givenName);
    navigation.goBack();
  };

  return (
    <ModalView
      left={
        <Text
          bold
          fontSize="md"
          mt="2"
          ml="4"
          style={{
            alignSelf: 'flex-start',
          }}>
          {i18n.t('screen_title.community')}
        </Text>
      }
      closeText={i18n.t('ui.done')}
      closeHandler={() => setFilter('')}>
      {brothers.length === 0 && (
        <View
          style={{
            flex: 3,
            justifyContent: 'space-around',
            padding: 10,
          }}>
          <Icon
            as={Ionicons}
            name="people-outline"
            size={32}
            alignSelf="center"
          />
          <Text textAlign="center">{i18n.t('ui.community empty')}</Text>
        </View>
      )}
      {brothers.length > 0 && (
        <SearchBarView value={filter} setValue={setFilter}>
          <FlashList
            data={filtered}
            keyExtractor={(item) => item.recordID}
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

export default ContactChooserDialog;
