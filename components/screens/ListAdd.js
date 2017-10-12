import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Text, Button, Item, Input, Label } from 'native-base';
import { LIST_CREATE, LIST_CREATE_NAME } from '../actions';

class ListAdd extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white'
        }}>
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
      </View>
    );
  }
}

const mapStateToProps = state => {
  var list_create_name = state.ui.get('list_create_name');
  var list_create_enabled = state.ui.get('list_create_enabled');
  return {
    listCreateName: list_create_name,
    listCreateEnabled: list_create_enabled
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateNewListName: text => {
      dispatch({ type: LIST_CREATE_NAME, name: text });
    },
    createNewList: () => {
      dispatch({ type: LIST_CREATE });
      if (ownProps.onListCreate) {
        ownProps.onListCreate();
      }
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListAdd);
