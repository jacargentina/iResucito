import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
  H1,
  H2,
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
            backgroundColor: 'white',
            padding: 20
          }}>
          <H1 style={{ paddingBottom: 15 }}>Agregar a Lista</H1>
          <Text style={{ fontStyle: 'italic', paddingBottom: 30 }}>
            {this.props.salmo}
          </Text>
          <H2 style={{ paddingBottom: 15 }}>Crear lista</H2>
          <Item style={{ marginBottom: 30 }} floatingLabel>
            <Label>Nombre</Label>
            <Input
              onChangeText={text => this.props.updateNewListName(text)}
              value={this.props.listCreateName}
              clearButtonMode="always"
              autoCorrect={false}
            />
          </Item>
          <Button
            primary
            block
            onPress={() => {
              this.props.createNewList();
            }}
            disabled={!this.props.listCreateEnabled}>
            <Text>Agregar</Text>
          </Button>
          <H2 style={{ paddingTop: 30, paddingBottom: 15 }}>{listsTitle}</H2>
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
  var lists = state.ui.get('lists');
  var listNames = lists.keySeq().toArray();
  var listsWithCount = listNames.map(name => {
    var list = lists.get(name);
    return {
      name: name,
      count: list.size
    };
  });
  return {
    salmo: salmo ? salmo.titulo : '',
    visible: visible,
    listCreateName: list_create_name,
    listCreateEnabled: list_create_enabled,
    lists: listsWithCount
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
    createNewList: list => {
      dispatch({ type: LIST_CREATE });
    },
    salmosAddToList: list => {
      dispatch({ type: LIST_ADD_SALMO, list: list });
      dispatch({ type: SET_LIST_DIALOG_VISIBLE, visible: false });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalmosAddDialog);
