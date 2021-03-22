// @flow
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { ListItem, Left, Body, Icon, Text, StyleProvider } from 'native-base';
import { Alert, FlatList, Platform } from 'react-native';
import Swipeout from 'react-native-swipeout';
import SearchBarView from './SearchBarView';
import { useNavigation } from '@react-navigation/native';
import { DataContext } from '../DataContext';
import CallToAction from './CallToAction';
import I18n from '../../translations';
import commonTheme from '../native-base-theme/variables/platform';
import getTheme from '../native-base-theme/components';

const ListScreen = (props: any) => {
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const { getListsForUI, removeList, chooseListTypeForAdd } = data.lists;
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('');

  const allLists = useMemo(() => getListsForUI(data.localeReal), [
    data.localeReal,
    getListsForUI,
  ]);

  useEffect(() => {
    var result = allLists;
    if (filter !== '') {
      result = result.filter((c) => c.name.includes(filter));
    }
    setFiltered(result);
  }, [allLists, filter]);

  const listDelete = (listName) => {
    Alert.alert(
      `${I18n.t('ui.delete')} "${listName}"`,
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          onPress: () => {
            removeList(listName);
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

  const listRename = (listName) => {
    navigation.navigate('ListName', {
      action: 'rename',
      listName: listName,
    });
  };

  if (allLists.length === 0) {
    return (
      <CallToAction
        icon="bookmarks-outline"
        title={I18n.t('call_to_action_title.add lists')}
        text={I18n.t('call_to_action_text.add lists')}
        buttonHandler={() => chooseListTypeForAdd(navigation)}
        buttonText={I18n.t('call_to_action_button.add lists')}
      />
    );
  }

  return (
    <SearchBarView value={filter} setValue={setFilter}>
      {filtered.length === 0 && (
        <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
          {I18n.t('ui.no lists found')}
        </Text>
      )}
      <StyleProvider style={getTheme(commonTheme)}>
        <FlatList
          data={filtered}
          extraData={I18n.locale}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            var swipeoutBtns = [
              {
                text: I18n.t('ui.rename'),
                type: 'primary',
                onPress: () => {
                  listRename(item.name);
                },
              },
              {
                text: I18n.t('ui.delete'),
                type: Platform.OS === 'ios' ? 'delete' : 'default',
                backgroundColor: Platform.OS === 'android' ? '#e57373' : null,
                onPress: () => {
                  listDelete(item.name);
                },
              },
            ];
            return (
              <Swipeout
                right={swipeoutBtns}
                backgroundColor="white"
                autoClose={true}>
                <ListItem
                  iconBig
                  onPress={() => {
                    navigation.navigate('ListDetail', {
                      listName: item.name,
                    });
                  }}>
                  <Left>
                    <Icon
                      name="bookmark"
                      style={{ color: commonTheme.brandInfo }}
                    />
                  </Left>
                  <Body big>
                    <Text style={{ fontSize: 26 }}>{item.name}</Text>
                    <Text note>{item.type}</Text>
                  </Body>
                </ListItem>
              </Swipeout>
            );
          }}
        />
      </StyleProvider>
    </SearchBarView>
  );
};

export default ListScreen;
