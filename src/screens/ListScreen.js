// @flow
import React, { useContext, useState, useEffect } from 'react';
import { withNavigation } from 'react-navigation';
import { ListItem, Left, Body, Icon, Text, ActionSheet } from 'native-base';
import { Alert, FlatList, Platform } from 'react-native';
import Swipeout from 'react-native-swipeout';
import SearchBarView from './SearchBarView';
import { DataContext } from '../DataContext';
import StackNavigatorOptions from '../StackNavigatorOptions';
import BaseCallToAction from './BaseCallToAction';
import I18n from '../translations';

const listAdd = (navigation: any) => {
  ActionSheet.show(
    {
      options: [
        I18n.t('list_type.eucharist'),
        I18n.t('list_type.word'),
        I18n.t('list_type.other'),
        I18n.t('ui.cancel')
      ],
      cancelButtonIndex: 3,
      title: I18n.t('ui.lists.type')
    },
    index => {
      var type = null;
      index = Number(index);
      switch (index) {
        case 0:
          type = 'eucaristia';
          break;
        case 1:
          type = 'palabra';
          break;
        case 2:
          type = 'libre';
          break;
      }
      navigation.navigate('ListAdd', { type });
    }
  );
};

const ListScreen = (props: any) => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const [uiLists, setUILists] = useState([]);
  const {
    lists,
    getListsForUI,
    removeList,
    save,
    filter,
    setFilter
  } = data.lists;

  useEffect(() => {
    setUILists(getListsForUI());
  }, [lists]);

  const listDelete = list => {
    Alert.alert(
      `${I18n.t('ui.delete')} "${list.name}"`,
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          onPress: () => {
            removeList(list.name);
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

  if (uiLists.length == 0)
    return (
      <BaseCallToAction
        icon="bookmark"
        title={I18n.t('call_to_action_title.add lists')}
        text={I18n.t('call_to_action_text.add lists')}
        buttonHandler={() => listAdd(navigation)}
        buttonText={I18n.t('call_to_action_button.add lists')}
      />
    );

  return (
    <SearchBarView value={filter} setValue={setFilter}>
      <FlatList
        data={uiLists}
        keyExtractor={item => item.name}
        renderItem={({ item }) => {
          var swipeoutBtns = [
            {
              text: I18n.t('ui.delete'),
              type: Platform.OS == 'ios' ? 'delete' : 'default',
              backgroundColor: Platform.OS == 'android' ? '#e57373' : null,
              onPress: () => {
                listDelete(item);
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
                    list: item
                  });
                }}>
                <Left>
                  <Icon name="bookmark" style={{ fontSize: 36 }} />
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

const AddList = withNavigation((props: any) => {
  const { navigation } = props;
  return (
    <Icon
      name="add"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => listAdd(navigation)}
    />
  );
});

ListScreen.navigationOptions = () => ({
  title: I18n.t('screen_title.lists'),
  headerRight: <AddList />
});

export default ListScreen;
