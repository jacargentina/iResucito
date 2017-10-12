import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Right, Body, Icon, Text } from 'native-base';
import { Alert, FlatList } from 'react-native';
import Swipeout from 'react-native-swipeout';
import BaseScreen from './BaseScreen';
import ListAddDialog from './ListAddDialog';
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
      <ListAddDialog />
      <FlatList
        data={props.items}
        keyExtractor={item => item.name}
        renderItem={({ item }) => {
          var swipeoutBtns = [
            {
              text: 'Eliminar',
              type: 'delete',
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
              <ListItem icon>
                <Left>
                  <Icon name="list" />
                </Left>
                <Body>
                  <Text>{item.name}</Text>
                </Body>
                <Right>
                  <Text>{item.count}</Text>
                </Right>
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
          onPress: () => dispatch({ type: LIST_DELETE, list: list }),
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
        marginRight: 12,
        color: appNavigatorConfig.navigationOptions.headerTitleStyle.color
      }}
      onPress={() => props.listAdd()}
    />
  );
};

const AddListButton = connect(mapStateToProps, mapDispatchToProps)(AddList);

ListScreen.navigationOptions = props => ({
  title: 'Listas',
  tabBarIcon: ({ tintColor }) => {
    return <Icon name="list" style={{ color: tintColor }} />;
  },
  headerRight: <AddListButton />
});

export default connect(mapStateToProps, mapDispatchToProps)(ListScreen);
