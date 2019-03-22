// @flow
import React, { useContext, useEffect, useRef, useState } from 'react';
import { withNavigation } from 'react-navigation';
import { ListItem, Right, Body, Icon, Text } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { Alert, FlatList, View } from 'react-native';
import SearchBarView from './SearchBarView';
import { DataContext } from '../DataContext';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import CallToAction from './CallToAction';
import commonTheme from '../native-base-theme/variables/platform';
import I18n from '../translations';
import ContactPhoto from './ContactPhoto';
import { contactFilterByText, ordenAlfabetico } from '../util';

const CommunityScreen = () => {
  const data = useContext(DataContext);
  const { brothers, update, remove, add, save } = data.community;
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
    if (filtered && filtered.length > 0) {
      setTimeout(() => {
        if (listRef.current)
          listRef.current.scrollToIndex({ index: 0, animated: true });
      }, 10);
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
    const newValue = !(contact[attribute] === true);
    var updatedContact = Object.assign({}, contact, { [attribute]: newValue });
    update(contact.recordID, updatedContact);
    save();
  };

  if (brothers.length == 0 && filter !== '')
    return (
      <CallToAction
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
    </SearchBarView>
  );
};

const ImportContactsButton = withNavigation((props: any) => {
  const { navigation } = props;
  return (
    <Icon
      name="add"
      style={{
        marginTop: 4,
        marginRight: 8,
        textAlign: 'center',
        color: StackNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => navigation.navigate('ContactImport')}
    />
  );
});

CommunityScreen.navigationOptions = () => ({
  title: I18n.t('screen_title.community'),
  headerRight: <ImportContactsButton />
});

export default CommunityScreen;
