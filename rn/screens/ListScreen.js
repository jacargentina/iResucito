// @flow
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { ListItem, Left, Body, Icon, Text } from 'native-base';
import { View, Alert, FlatList, Platform } from 'react-native';
import Swipeout from 'react-native-swipeout';
import SearchBarView from './SearchBarView';
import { DataContext } from '../DataContext';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import CallToAction from './CallToAction';
import I18n from '../../translations';
import commonTheme from '../native-base-theme/variables/platform';

const titleLocaleKey = 'screen_title.lists';

const ListScreen = (props: any) => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const { lists, getListsForUI, removeList, chooseListTypeForAdd } = data.lists;
  const [filtered, setFiltered] = useState();
  const [filter, setFilter] = useState('');
  const allLists = useMemo(() => getListsForUI(), [lists]);

  useEffect(() => {
    navigation.setParams({ title: I18n.t(titleLocaleKey) });
  }, [I18n.locale]);

  useEffect(() => {
    var result = allLists;
    if (filter !== '') {
      result = result.filter(c => c.name.includes(filter));
    }
    setFiltered(result);
  }, [allLists, filter]);

  const listDelete = listName => {
    Alert.alert(
      `${I18n.t('ui.delete')} "${listName}"`,
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          onPress: () => {
            removeList(listName);
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

  const listRename = listName => {
    navigation.navigate('ListName', {
      action: 'rename',
      listName: listName
    });
  };

  if (allLists.length === 0) {
    return (
      <CallToAction
        icon="bookmark"
        title={I18n.t('call_to_action_title.add lists')}
        text={I18n.t('call_to_action_text.add lists')}
        buttonHandler={chooseListTypeForAdd}
        buttonText={I18n.t('call_to_action_button.add lists')}
      />
    );
  }

  return (
    <SearchBarView value={filter} setValue={setFilter}>
      {filtered && filtered.length === 0 && (
        <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
          {I18n.t('ui.no lists found')}
        </Text>
      )}
      <FlatList
        data={filtered}
        extraData={I18n.locale}
        keyExtractor={item => item.name}
        renderItem={({ item }) => {
          var swipeoutBtns = [
            {
              text: I18n.t('ui.rename'),
              type: 'primary',
              onPress: () => {
                listRename(item.name);
              }
            },
            {
              text: I18n.t('ui.delete'),
              type: Platform.OS === 'ios' ? 'delete' : 'default',
              backgroundColor: Platform.OS === 'android' ? '#e57373' : null,
              onPress: () => {
                listDelete(item.name);
              }
            }
          ];
          return (
            <Swipeout
              right={swipeoutBtns}
              backgroundColor="white"
              autoClose={true}>
              <ListItem
                avatar
                onPress={() => {
                  navigation.navigate('ListDetail', {
                    listName: item.name
                  });
                }}>
                <Left>
                  <Icon
                    name="bookmark"
                    style={{ fontSize: 36, color: commonTheme.brandInfo }}
                  />
                </Left>
                <Body>
                  <Text style={{ fontSize: 26 }}>{item.name}</Text>
                  <Text note>{item.type}</Text>
                </Body>
              </ListItem>
            </Swipeout>
          );
        }}
      />
    </SearchBarView>
  );
};

const AddList = () => {
  const data = useContext(DataContext);
  const { chooseListTypeForAdd } = data.lists;
  return (
    <Icon
      name="add"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions().headerTitleStyle.color
      }}
      onPress={chooseListTypeForAdd}
    />
  );
};

ListScreen.navigationOptions = () => {
  return {
    title: I18n.t(titleLocaleKey),
    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        <AddList />
      </View>
    )
  };
};

export default ListScreen;
