import React from 'react';
import { connect } from 'react-redux';
import { Text, Input, Item, Label } from 'native-base';
import {
  SET_LIST_ADD_VISIBLE,
  LIST_CREATE,
  LIST_CREATE_NAME,
  LIST_ADD_SALMO
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
    return (
      <BaseModal
        visible={this.props.visible}
        modalShow={() => this.focusInput()}
        closeModal={() => this.props.closeListAdd()}
        acceptModal={() =>
          this.props.createNewList(this.props.listCreateName, this.props.salmo)}
        acceptDisabled={!this.props.listCreateEnabled}
        acceptText="Agregar"
        title="Crear Lista">
        <Item
          style={{ marginBottom: 20 }}
          floatingLabel
          error={!this.props.listCreateEnabled}
          success={this.props.listCreateEnabled}>
          <Label>Nombre</Label>
          <Input
            getRef={input => {
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
    createNewList: (name, salmo) => {
      dispatch({ type: LIST_CREATE, name: name });
      if (salmo) {
        dispatch({ type: LIST_ADD_SALMO, list: name, salmo: salmo });
        setTimeout(() => {
          Toast.showWithGravity(
            `Creaste la lista "${name}" y agregaste "${salmo.titulo}"`, Toast.SHORT, Toast.BOTTOM
          );
        }, 350);
      }
      dispatch({ type: SET_LIST_ADD_VISIBLE, visible: false, salmo: null });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListAddDialog);
