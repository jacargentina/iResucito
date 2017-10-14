import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Body, Icon, Text, Badge } from 'native-base';
import { Alert, FlatList, Platform } from 'react-native';
import Swipeout from 'react-native-swipeout';
import BaseScreen from './BaseScreen';
import { getProcessedLists } from '../selectors';
import { SET_LIST_ADD_VISIBLE, LIST_DELETE } from '../actions';
import { appNavigatorConfig } from '../AppNavigator';

const ListScreen = props => {
  if (props.items.length == 0) {
    var sinItems = (
      <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
        Ningúna lista definida
      </Text>
    );
  }
  return (
    <BaseScreen>
      {sinItems}
      <FlatList
        data={props.items}
        keyExtractor={item => item.name}
        renderItem={({ item }) => {
          var swipeoutBtns = [
            {
              text: 'Eliminar',
              type: Platform.OS == 'ios' ? 'delete' : 'default',
              backgroundColor: Platform.OS == 'android' ? '#e57373' : null,
              onPress: () => {
                props.listDelete(item);
              }
            }
          ];
          var note = item.count > 0 ? `${item.count} salmos` : 'vacía';
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
                  <Badge style={{ backgroundColor: 'transparent' }}>
                    <Icon name="bookmark" />
                  </Badge>
                </Left>
                <Body>
                  <Text>{item.name}</Text>
                  <Text note>{note}</Text>
                </Body>
              </ListItem>
            </Swipeout>
          );
        }}
      />
    </BaseScreen>
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
      Alert.alert(`Eliminar "${list.name}"`, '¿Confirma el borrado?', [
        {
          text: 'Eliminar',
          onPress: () => dispatch({ type: LIST_DELETE, list: list.name }),
          style: 'destructive'
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]);
    },
    listAdd: () => {
      dispatch({ type: SET_LIST_ADD_VISIBLE, visible: true });
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
        color: appNavigatorConfig.navigationOptions.headerTitleStyle.color
      }}
      onPress={() => props.listAdd()}
    />
  );
};

const AddListButton = connect(mapStateToProps, mapDispatchToProps)(AddList);

ListScreen.navigationOptions = props => ({
  title: 'Listas',
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
