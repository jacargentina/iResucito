import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Right, Body, Icon, Text, Button } from 'native-base';
import { FlatList, View } from 'react-native';
import Modal from 'react-native-modal';
import { SET_LIST_CHOOSER_VISIBLE, LIST_ADD_SALMO } from '../actions';
import { getProcessedLists } from '../selectors';
import ListAdd from './ListAdd';

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
          <ListAdd {...this.props} />
          <Button danger block onPress={() => this.props.closeSalmosAdd()}>
            <Text>Cancelar</Text>
          </Button>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  var visible = state.ui.get('list_chooser_visible');
  var salmo = state.ui.get('salmo_selected');
  var lists = getProcessedLists(state);
  return {
    visible: visible,
    salmo: salmo ? salmo.titulo : '',
    lists: lists
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListChooser);
