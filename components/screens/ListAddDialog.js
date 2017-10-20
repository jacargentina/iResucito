import React from 'react';
import { connect } from 'react-redux';
import { Text, Input, Item, Button } from 'native-base';
import {
  SET_LIST_ADD_VISIBLE,
  LIST_CREATE,
  LIST_CREATE_NAME,
  addSalmoToList
} from '../actions';
import BaseModal from './BaseModal';
import Toast from 'react-native-simple-toast';

class ListAddDialog extends React.Component {
  constructor(props) {
    super(props);
    this.focusInput = this.focusInput.bind(this);
  }

  focusInput() {
    this.listNameInput._root.focus();
  }

  render() {
    if (!this.props.listCreateEnabled) {
      var disabledReasonText =
        this.props.listCreateName && this.props.listCreateName.trim() !== ''
          ? 'Ya existe una lista con el mismo nombre'
          : 'Ingrese un nombre no vacío';
    }
    var acceptButtons = [
      <Button
        key="0"
        style={{ flex: 1, margin: 2, justifyContent: 'center' }}
        primary
        onPress={() =>
          this.props.createNewList(
            this.props.listCreateName,
            'palabra',
            this.props.salmo
          )}
        disabled={!this.props.listCreateEnabled}>
        <Text>Palabra</Text>
      </Button>,
      <Button
        key="1"
        style={{ flex: 1, margin: 2, justifyContent: 'center' }}
        primary
        onPress={() =>
          this.props.createNewList(
            this.props.listCreateName,
            'eucaristia',
            this.props.salmo
          )}
        disabled={!this.props.listCreateEnabled}>
        <Text>Eucaristía</Text>
      </Button>,
      <Button
        key="2"
        style={{ flex: 1, margin: 2, justifyContent: 'center' }}
        primary
        onPress={() =>
          this.props.createNewList(
            this.props.listCreateName,
            'libre',
            this.props.salmo
          )}
        disabled={!this.props.listCreateEnabled}>
        <Text>Libre</Text>
      </Button>
    ];
    return (
      <BaseModal
        visible={this.props.visible}
        modalShow={() => this.focusInput()}
        closeModal={() => this.props.closeListAdd()}
        acceptButtons={acceptButtons}
        title="Crear Lista">
        <Item
          style={{ marginBottom: 20 }}
          error={!this.props.listCreateEnabled}
          success={this.props.listCreateEnabled}>
          <Input
            ref={input => {
              this.listNameInput = input;
            }}
            onChangeText={text => this.props.updateNewListName(text)}
            value={this.props.listCreateName}
            clearButtonMode="always"
            autoCorrect={false}
          />
        </Item>
        <Text danger note>
          {disabledReasonText}
        </Text>
      </BaseModal>
    );
  }
}

const mapStateToProps = state => {
  var visible = state.ui.get('list_add_visible');
  var salmo = state.ui.get('list_add_salmo');
  var list_create_name = state.ui.get('list_create_name');
  var list_create_enabled = state.ui.get('list_create_enabled');
  return {
    visible: visible,
    salmo: salmo,
    listCreateName: list_create_name,
    listCreateEnabled: list_create_enabled
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeListAdd: () => {
      dispatch({ type: SET_LIST_ADD_VISIBLE, visible: false, salmo: null });
    },
    updateNewListName: text => {
      dispatch({ type: LIST_CREATE_NAME, name: text });
    },
    createNewList: (name, type, salmo) => {
      dispatch({ type: LIST_CREATE, name: name });
      dispatch({ type: SET_LIST_ADD_VISIBLE, visible: false, salmo: null });
      if (salmo) {
        dispatch(addSalmoToList(salmo, name))
          .then(message => {
            setTimeout(() => {
              Toast.showWithGravity(message, Toast.SHORT, Toast.BOTTOM);
            }, 350);
          })
          .catch(error => {
            setTimeout(() => {
              Toast.showWithGravity(error, Toast.SHORT, Toast.BOTTOM);
            }, 350);
          });
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListAddDialog);
