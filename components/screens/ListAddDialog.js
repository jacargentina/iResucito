import React from 'react';
import { connect } from 'react-redux';
import { Container, Text, Button, Item, Input, Label } from 'native-base';
import { SET_LIST_ADD_VISIBLE } from '../actions';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import ListAdd from './ListAdd';

class ListAddDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
          <ListAdd onListCreate={() => this.props.closeListAdd()} />
          <Button danger block onPress={() => this.props.closeListAdd()}>
            <Text>Cancelar</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  var visible = state.ui.get('list_add_visible');
  return {
    visible: visible
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeListAdd: () => {
      dispatch({ type: SET_LIST_ADD_VISIBLE, visible: false });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListAddDialog);
