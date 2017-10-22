import React from 'react';
import { connect } from 'react-redux';
import { Text, Button, Icon, ListItem, Left, Body, Input } from 'native-base';
import { View, Alert } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { openSalmoChooserDialog } from '../actions';
import { getFriendlyText } from '../util';

const LiturgiaChooser = props => {
  var titulo = getFriendlyText(props.listKey);
  var item = null;
  if (
    props.listKey == '1' ||
    props.listKey == '2' ||
    props.listKey == '3' ||
    props.listKey == 'evangelio'
  ) {
    // var cita = props.listMap.get(props.listKey);
    // var textoCita = !cita ? 'Cita...' : cita;
    var swipeoutBtns = [
      {
        text: 'Limpiar',
        type: 'delete',
        onPress: () => {
          props.cleanItem(props.listMap, props.listKey);
        }
      }
    ];
    item = (
      <Swipeout right={swipeoutBtns} backgroundColor="white" autoClose={true}>
        <ListItem icon>
          <Left>
            <Icon name="book" />
          </Left>
          <Body>
            <Input
              onChangeText={null} //text => this.props.updateNewListName(text)
              value=""
              clearButtonMode="always"
              autoCorrect={false}
            />
          </Body>
        </ListItem>
      </Swipeout>
    );
  } else if (
    props.listKey.includes('monicion') ||
    props.listKey.includes('ambiental')
  ) {
    // var nombre = props.listMap.get(props.listKey);
    // var textoMonicion = !nombre ? 'Seleccionar...' : nombre;
    item = (
      <Swipeout right={null} backgroundColor="white" autoClose={true}>
        <ListItem icon>
          <Left>
            <Icon name="person" />
          </Left>
          <Body>
            <Input
              onChangeText={null} //text => this.props.updateNewListName(text)
              value=""
              clearButtonMode="always"
              autoCorrect={false}
            />
          </Body>
        </ListItem>
      </Swipeout>
    );
  } else {
    var salmo = props.listMap.get(props.listKey);
    var textoSalmo = !salmo ? 'Buscar...' : salmo.titulo;
    item = (
      <Swipeout right={null} backgroundColor="white" autoClose={true}>
        <ListItem icon>
          <Left>
            <Icon name="musical-notes" />
          </Left>
          <Body>
            <Button
              transparent
              small
              onPress={() =>
                props.openSalmoChooser(props.listName, props.listKey)}>
              <Text>{textoSalmo}</Text>
            </Button>
          </Body>
        </ListItem>
      </Swipeout>
    );
  }
  return (
    <View>
      <ListItem itemDivider>
        <Text>{titulo}</Text>
      </ListItem>
      {item}
    </View>
  );
};

const mapStateToProps = (state, props) => {
  return {
    listMap: props.listMap,
    listName: props.listName,
    listKey: props.listKey
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openSalmoChooser: (list, key) => {
      dispatch(openSalmoChooserDialog(list, key));
    },
    cleanItem: (list, key) => {
      Alert.alert('Falta implementar', key);
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LiturgiaChooser);
