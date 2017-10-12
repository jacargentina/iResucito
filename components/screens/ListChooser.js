import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Right, Body, Icon, Text, Button } from 'native-base';
import { FlatList, View } from 'react-native';
import Modal from 'react-native-modal';
import {
  SET_LIST_CHOOSER_VISIBLE,
  LIST_ADD_SALMO,
  SET_LIST_ADD_VISIBLE,
  SET_LIST_CREATE_NEW
} from '../actions';
import { getProcessedLists } from '../selectors';

class ListChooser extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var listsTitle =
      this.props.lists.length > 0 ? 'Seleccionar lista' : 'No hay listas';
    return (
      <Modal
        isVisible={this.props.visible}
        onBackButtonPress={() => this.props.closeSalmosAdd()}
        onBackdropPress={() => this.props.closeSalmosAdd()}
        onModalHide={() => this.props.openNewDialog(this.props.listCreateNew)}>
        <View
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: 'white'
          }}>
          <View
            style={{
              flex: 9
            }}>
            <Text note style={{ fontStyle: 'italic', marginBottom: 20 }}>
              {this.props.salmo}
            </Text>
            <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>
              {listsTitle}
            </Text>
            <FlatList
              style={{ marginBottom: 20 }}
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
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around'
            }}>
            <Button
              style={{
                flex: 1,
                marginRight: 5,
                alignSelf: 'flex-end'
              }}
              primary
              block
              onPress={() => this.props.closeAndAddToNewList()}>
              <Text>Crear</Text>
            </Button>
            <Button
              style={{
                flex: 1,
                marginLeft: 5,
                alignSelf: 'flex-end'
              }}
              danger
              block
              onPress={() => this.props.closeSalmosAdd()}>
              <Text>Cancelar</Text>
            </Button>
          </View>
        </View>
      </Modal>
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
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListChooser);
