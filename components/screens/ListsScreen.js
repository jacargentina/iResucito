import React from 'react';
import { connect } from 'react-redux';
import {
  ListItem,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Badge,
  Content,
  Container,
  Button,
  H2,
  Input,
  Item,
  Label
} from 'native-base';
import { FlatList, View } from 'react-native';
import Modal from 'react-native-modal';
import { _ } from 'lodash';
import BaseScreen from './BaseScreen';
import SalmosAddDialog from './SalmosAddDialog';
import {
  SET_SALMOS_FILTER,
  SET_LIST_DIALOG_VISIBLE,
  SET_SALMOS_SELECTED
} from '../actions';
import { getProcessedLists } from '../selectors';

const ListsScreen = props => {
  if (props.items.length == 0) {
    var sinItems = (
      <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
        Ningúna lista definida
      </Text>
    );
  }
  return (
    <BaseScreen {...props}>
      {sinItems}
      <SalmosAddDialog />
      <FlatList
        data={props.items}
        keyExtractor={item => item.name}
        renderItem={({ item }) => {
          return (
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
          );
        }}
      />
    </BaseScreen>
  );
};

const mapStateToProps = state => {
  // var filter = state.ui.get('salmos_filter');
  // var menu = state.ui.get('menu');
  // var badges = state.ui.get('badges');
  // var items = [];
  // if (salmos) {
  //   if (filter) {
  //     for (var name in filter) {
  //       items = salmos.filter(s => s[name] == filter[name]);
  //     }
  //   } else {
  //     items = salmos;
  //   }
  // }
  // var text_filter = state.ui.get('salmos_text_filter');
  // if (text_filter) {
  //   items = items.filter(s => {
  //     return s.nombre.toLowerCase().includes(text_filter.toLowerCase());
  //   });
  // }
  return {
    items: getProcessedLists(state)
  };
};

const mapDispatchToProps = dispatch => {
  // var filtrar = text => {
  //   dispatch({ type: SET_SALMOS_FILTER, filter: text });
  // };
  // return {
  //   filtrarHandler: _.debounce(filtrar, 600),
  //   showSalmosAdd: salmo => {
  //     dispatch({ type: SET_SALMOS_SELECTED, salmo: salmo });
  //     dispatch({ type: SET_LIST_DIALOG_VISIBLE, visible: true });
  //   }
  // };
  return {};
};

ListsScreen.navigationOptions = props => ({
  title: 'Listas',
  tabBarIcon: ({ tintColor }) => {
    return <Icon name="list" style={{ color: tintColor }} />;
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ListsScreen);
