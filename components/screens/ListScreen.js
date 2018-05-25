// @flow
import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Body, Icon, Text, ActionSheet } from 'native-base';
import { Alert, FlatList, Platform } from 'react-native';
import Swipeout from 'react-native-swipeout';
import SearchBarView from './SearchBarView';
import { getProcessedLists } from '../selectors';
import {
  showListAddDialog,
  saveLists,
  updateListAddType,
  deleteList
} from '../actions';
import AppNavigatorOptions from '../AppNavigatorOptions';
import BaseCallToAction from './BaseCallToAction';
import I18n from '../translations';

const ListScreen = (props: any) => {
  if (props.items.length == 0)
    return (
      <BaseCallToAction
        icon="bookmark"
        title={I18n.t('call_to_action_title.add lists')}
        text={I18n.t('call_to_action_text.add lists')}
        buttonHandler={() => props.listAdd()}
        buttonText={I18n.t('call_to_action_button.add lists')}
      />
    );
  return (
    <SearchBarView>
      <FlatList
        data={props.items}
        keyExtractor={item => item.name}
        renderItem={({ item }) => {
          var swipeoutBtns = [
            {
              text: I18n.t('ui.delete'),
              type: Platform.OS == 'ios' ? 'delete' : 'default',
              backgroundColor: Platform.OS == 'android' ? '#e57373' : null,
              onPress: () => {
                props.listDelete(item);
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
                  props.navigation.navigate('ListDetail', {
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

const mapStateToProps = state => {
  return {
    items: getProcessedLists(state)
  };
};

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => {
  return {
    listDelete: list => {
      Alert.alert(
        `${I18n.t('ui.delete')} "${list.name}"`,
        I18n.t('ui.delete confirmation'),
        [
          {
            text: I18n.t('ui.delete'),
            onPress: () => {
              dispatch(deleteList(list.name));
              dispatch(saveLists());
            },
            style: 'destructive'
          },
          {
            text: I18n.t('ui.cancel'),
            style: 'cancel'
          }
        ]
      );
    },
    listAdd: () => {
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
          if (type) {
            dispatch(updateListAddType(type));
            dispatch(showListAddDialog());
          }
        }
      );
    }
  };
};

const AddList = props => {
  return (
    <Icon
      name="add"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 40,
        textAlign: 'center',
        color: AppNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => props.listAdd()}
    />
  );
};

const AddListButton = connect(mapStateToProps, mapDispatchToProps)(AddList);

ListScreen.navigationOptions = props => ({
  title: I18n.t('screen_title.lists'),
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="bookmark"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  },
  headerRight: <AddListButton />
});

export default connect(mapStateToProps, mapDispatchToProps)(ListScreen);
