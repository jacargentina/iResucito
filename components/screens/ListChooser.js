import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Right, Body, Icon, Text } from 'native-base';
import { FlatList } from 'react-native';
import {
  SET_LIST_CHOOSER_VISIBLE,
  LIST_ADD_SALMO,
  SET_LIST_ADD_VISIBLE,
  SET_LIST_CREATE_NEW
} from '../actions';
import { getProcessedLists } from '../selectors';
import BaseModal from './BaseModal';

class ListChooser extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var listsTitle =
      this.props.lists.length > 0 ? 'Seleccionar lista' : 'No hay listas';
    return (
      <BaseModal
        visible={this.props.visible}
        modalHide={() => this.props.openNewDialog(this.props.listCreateNew)}
        closeModal={() => this.props.closeSalmosAdd()}
        acceptModal={() => this.props.closeAndAddToNewList()}
        acceptText="Crear Lista"
        title={listsTitle}>
        <Text note style={{ fontStyle: 'italic', marginBottom: 20 }}>
          {this.props.salmo}
        </Text>
        <FlatList
          data={this.props.lists}
          keyExtractor={item => item.name}
          renderItem={({ item }) => {
            return (
              <ListItem
                style={{ marginLeft: 0, paddingLeft: 0 }}
                icon
                onPress={() => {
                  this.props.salmosAddToList(item);
                }}>
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
      </BaseModal>
    );
  }
}

const mapStateToProps = state => {
  var visible = state.ui.get('list_chooser_visible');
  var listCreateNew = state.ui.get('list_create_new');
  var salmo = state.ui.get('salmo_selected');
  var lists = getProcessedLists(state);
  return {
    visible: visible,
    salmo: salmo ? salmo.titulo : '',
    lists: lists,
    listCreateNew: listCreateNew
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeSalmosAdd: () => {
      dispatch({ type: SET_LIST_CHOOSER_VISIBLE, visible: false });
    },
    salmosAddToList: list => {
      dispatch({ type: LIST_ADD_SALMO, list: list });
      dispatch({ type: SET_LIST_CHOOSER_VISIBLE, visible: false });
    },
    closeAndAddToNewList: () => {
      dispatch({ type: SET_LIST_CHOOSER_VISIBLE, visible: false });
      dispatch({ type: SET_LIST_CREATE_NEW, value: true });
    },
    openNewDialog: listCreateNew => {
      if (listCreateNew) {
        dispatch({ type: SET_LIST_ADD_VISIBLE, visible: true });
        dispatch({ type: SET_LIST_CREATE_NEW, value: false });
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListChooser);
