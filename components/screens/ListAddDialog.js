import React from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { Text, Input, Item, Button, View } from 'native-base';
import {
  hideListAddDialog,
  createList,
  saveLists,
  updateListAddName
} from '../actions';
import BaseModal from './BaseModal';
import { getFriendlyTextForListType } from '../util';
import I18n from '../translations';

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
          ? I18n.t('ui.lists.already exists')
          : I18n.t('ui.lists.non-empty name');
    }
    var acceptButtons = (
      <Button
        style={{ marginRight: 10, marginBottom: 10 }}
        primary
        onPress={() =>
          this.props.createNewList(
            this.props.listCreateName,
            this.props.listCreateType
          )
        }
        disabled={!this.props.listCreateEnabled}>
        <Text>{I18n.t('ui.create')}</Text>
      </Button>
    );
    var titleSuffix = getFriendlyTextForListType(this.props.listCreateType);
    return (
      <BaseModal
        visible={this.props.visible}
        modalShow={() => this.focusInput()}
        closeModal={() => this.props.closeListAdd()}
        acceptButtons={acceptButtons}
        title={`${I18n.t('ui.lists.create')} (${titleSuffix})`}>
        <View style={{ padding: 10 }}>
          <Item
            style={{ marginBottom: 20 }}
            error={!this.props.listCreateEnabled}
            success={this.props.listCreateEnabled}>
            <Input
              ref={input => {
                this.listNameInput = input;
              }}
              onChangeText={text => this.props.listNameChanged(text)}
              value={this.props.listCreateName}
              clearButtonMode="always"
              autoCorrect={false}
            />
          </Item>
          <Text danger note>
            {disabledReasonText}
          </Text>
        </View>
      </BaseModal>
    );
  }
}

const mapStateToProps = state => {
  var visible = state.ui.get('list_add_visible');
  var list_create_type = state.ui.get('list_create_type');
  var list_create_name = state.ui.get('list_create_name');
  var list_create_enabled = state.ui.get('list_create_enabled');
  return {
    visible: visible,
    listCreateType: list_create_type,
    listCreateName: list_create_name,
    listCreateEnabled: list_create_enabled
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeListAdd: () => {
      dispatch(hideListAddDialog());
    },
    listNameChanged: text => {
      dispatch(updateListAddName(text));
    },
    createNewList: (name, type) => {
      dispatch(createList(name, type));
      dispatch(saveLists());
      dispatch(hideListAddDialog());
      dispatch(
        NavigationActions.navigate({
          routeName: 'ListDetail',
          params: {
            list: { name: name }
          }
        })
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListAddDialog);
