import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Body, Icon, Badge, Text } from 'native-base';
import { FlatList } from 'react-native';
import {
  SET_LIST_CHOOSER_SALMO,
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
    var listsTitle = this.props.lists.length > 0 ? 'Agregar en...' : '';
    return (
      <BaseModal
        visible={this.props.salmo !== null}
        modalHide={() => this.props.openNewDialog(this.props.listCreateNew)}
        closeModal={() => this.props.closeSalmosAdd()}
        acceptModal={() => this.props.closeAndAddToNewList()}
        acceptText="Crear Lista"
        title={listsTitle}>
        <Text
          style={{
            fontStyle: 'italic',
            color: 'gray',
            marginLeft: 20,
            marginBottom: 20
          }}>
          {this.props.salmo ? this.props.salmo.titulo : ''}
        </Text>
        <FlatList
          data={this.props.lists}
          keyExtractor={item => item.name}
          renderItem={({ item }) => {
            return (
              <ListItem
                style={{ marginLeft: 0, paddingLeft: 0 }}
                avatar
                onPress={() => {
                  this.props.salmoAddToList(this.props.salmo, item);
                }}>
                <Left>
                  <Badge style={{ backgroundColor: 'transparent' }}>
                    <Icon name="bookmark" />
                  </Badge>
                </Left>
                <Body>
                  <Text>
                    {item.name}
                    <Text note> ({item.count})</Text>
                  </Text>
                </Body>
              </ListItem>
            );
          }}
        />
      </BaseModal>
    );
  }
}

const mapStateToProps = state => {
  var salmo = state.ui.get('list_chooser_salmo');
  var listCreateNew = state.ui.get('list_create_new');
  var lists = getProcessedLists(state);
  return {
    salmo: salmo,
    lists: lists,
    listCreateNew: listCreateNew
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeSalmosAdd: () => {
      dispatch({ type: SET_LIST_CHOOSER_SALMO, salmo: null });
    },
    salmoAddToList: (salmo, list) => {
      dispatch({ type: LIST_ADD_SALMO, list: list.name, salmo: salmo });
      dispatch({ type: SET_LIST_CHOOSER_SALMO, salmo: null });
    },
    closeAndAddToNewList: () => {
      dispatch({ type: SET_LIST_CHOOSER_SALMO, salmo: null });
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
