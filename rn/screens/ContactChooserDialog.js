// @flow
import * as React from 'react';
import { useContext, useState, useMemo } from 'react';
import { Text, Icon, Button } from 'native-base';
import { FlatList, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ModalView from '../components/ModalView';
import { DataContext } from '../DataContext';
import I18n from '../../translations';
import { contactFilterByText, ordenAlfabetico } from '../util';
import SearchBarView from '../components/SearchBarView';
import ContactListItem from './ContactListItem';

const ContactChooserDialog = (props: any): React.Node => {
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { setList } = data.lists;
  const { brothers } = data.community;
  const [filter, setFilter] = useState('');
  const { target } = route.params;

  const filtered = useMemo(() => {
    var result = brothers.filter((c) => contactFilterByText(c, filter));
    result.sort(ordenAlfabetico);
    return result;
  }, [brothers, filter]);

  const contactSelected = (contact) => {
    setList(target.listName, target.listKey, contact.givenName);
    navigation.goBack(null);
  };

  const close = () => {
    setFilter('');
    navigation.goBack(null);
  };

  return (
    <ModalView
      right={
        <Button
          rounded
          small
          style={{
            alignSelf: 'flex-end',
            color: commonTheme.brandPrimary,
            marginRight: 10,
          }}
          onPress={close}>
          <Text>{I18n.t('ui.done')}</Text>
        </Button>
      }
      left={
        <Text
          style={{
            alignSelf: 'flex-start',
            marginLeft: 10,
            fontSize: commonTheme.fontSizeBase + 3,
            fontWeight: 'bold',
          }}>
          {I18n.t('screen_title.community')}
        </Text>
      }>
      {brothers.length === 0 && (
        <View
          style={{
            flex: 3,
            justifyContent: 'space-around',
            padding: 10,
          }}>
          <Icon
            name="people-outline"
            style={{
              fontSize: 120,
              color: commonTheme.brandPrimary,
              alignSelf: 'center',
            }}
          />
          <Text note style={{ textAlign: 'center' }}>
            {I18n.t('ui.community empty')}
          </Text>
        </View>
      )}
      {brothers.length > 0 && (
        <SearchBarView value={filter} setValue={setFilter}>
          <FlatList
            style={{ flex: 1 }}
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
          />
        </SearchBarView>
      )}
    </ModalView>
  );
};

export default ContactChooserDialog;
