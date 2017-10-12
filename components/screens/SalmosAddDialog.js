import React from 'react';
import { connect } from 'react-redux';
import {
  ListItem,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Button,
  Input,
  Item,
  Label
} from 'native-base';
import { FlatList, View } from 'react-native';
import Modal from 'react-native-modal';
import {
  SET_LIST_DIALOG_VISIBLE,
  LIST_ADD_SALMO,
  LIST_CREATE,
  LIST_CREATE_NAME
} from '../actions';
import { getProcessedLists } from '../selectors';

class SalmosAddDialog extends React.Component {
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
        onBackdropPress={() => this.props.closeSalmosAdd()}>
        <View
          style={{
            flex: 1,
            padding: 20,
            backgroundColor: 'white'
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
          <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>
            Crear lista
          </Text>
          <Item style={{ marginBottom: 20 }} floatingLabel>
            <Label>Nombre</Label>
            <Input
              onChangeText={text => this.props.updateNewListName(text)}
              value={this.props.listCreateName}
              clearButtonMode="always"
              autoCorrect={false}
            />
          </Item>
          <Button
            style={{ marginBottom: 20 }}
            primary
            block
            onPress={() => {
              this.props.createNewList();
            }}
            disabled={!this.props.listCreateEnabled}>
            <Text>Agregar</Text>
          </Button>
          <Button danger block onPress={() => this.props.closeSalmosAdd()}>
            <Text>Cancelar</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  var salmo = state.ui.get('salmo_selected');
  var visible = state.ui.get('list_dialog_visible');
  var list_create_name = state.ui.get('list_create_name');
  var list_create_enabled = state.ui.get('list_create_enabled');
  var lists = getProcessedLists(state);
  return {
    salmo: salmo ? salmo.titulo : '',
    visible: visible,
    listCreateName: list_create_name,
    listCreateEnabled: list_create_enabled,
    lists: lists
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeSalmosAdd: () => {
      dispatch({ type: SET_LIST_DIALOG_VISIBLE, visible: false });
    },
    updateNewListName: text => {
      dispatch({ type: LIST_CREATE_NAME, name: text });
    },
    createNewList: () => {
      dispatch({ type: LIST_CREATE });
    },
    salmosAddToList: list => {
      dispatch({ type: LIST_ADD_SALMO, list: list });
      dispatch({ type: SET_LIST_DIALOG_VISIBLE, visible: false });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalmosAddDialog);
