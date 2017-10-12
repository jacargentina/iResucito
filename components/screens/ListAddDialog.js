import React from 'react';
import { connect } from 'react-redux';
import { Text, Button, Item, Input, Label } from 'native-base';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import {
  SET_LIST_ADD_VISIBLE,
  LIST_CREATE,
  LIST_CREATE_NAME
} from '../actions';

class ListAddDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.listCreateEnabled) {
      var disabledReasonText =
        this.props.listCreateName && this.props.listCreateName.trim() !== ''
          ? 'Ya existe una lista con el mismo nombre'
          : 'Ingrese un nombre no vacío';
    }
    return (
      <Modal
        isVisible={this.props.visible}
        onBackButtonPress={() => this.props.closeListAdd()}
        onBackdropPress={() => this.props.closeListAdd()}>
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
            <Text style={{ fontWeight: 'bold', marginBottom: 20 }}>
              Crear lista
            </Text>
            <Item
              style={{ marginBottom: 20 }}
              floatingLabel
              error={!this.props.listCreateEnabled}
              success={this.props.listCreateEnabled}>
              <Label>Nombre</Label>
              <Input
                onChangeText={text => this.props.updateNewListName(text)}
                value={this.props.listCreateName}
                clearButtonMode="always"
                autoCorrect={false}
              />
            </Item>
            <Text danger note>
              {disabledReasonText}
            </Text>
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
              bordered
              block
              primary
              onPress={() => this.props.createNewList()}
              disabled={!this.props.listCreateEnabled}>
              <Text>Agregar</Text>
            </Button>
            <Button
              style={{
                flex: 1,
                marginLeft: 5,
                alignSelf: 'flex-end'
              }}
              bordered
              block
              danger
              onPress={() => this.props.closeListAdd()}>
              <Text>Cancelar</Text>
            </Button>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  var visible = state.ui.get('list_add_visible');
  var list_create_name = state.ui.get('list_create_name');
  var list_create_enabled = state.ui.get('list_create_enabled');
  return {
    visible: visible,
    listCreateName: list_create_name,
    listCreateEnabled: list_create_enabled
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeListAdd: () => {
      dispatch({ type: SET_LIST_ADD_VISIBLE, visible: false });
    },
    updateNewListName: text => {
      dispatch({ type: LIST_CREATE_NAME, name: text });
    },
    createNewList: () => {
      dispatch({ type: LIST_CREATE });
      dispatch({ type: SET_LIST_ADD_VISIBLE, visible: false });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListAddDialog);
