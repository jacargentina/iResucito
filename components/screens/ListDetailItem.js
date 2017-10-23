import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  Button,
  Icon,
  ListItem,
  Left,
  Body,
  Input,
  Right
} from 'native-base';
import { View, Alert } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { openSalmoChooserDialog, updateListMapText } from '../actions';
import { getFriendlyText } from '../util';
import commonTheme from '../../native-base-theme/variables/platform';

const ListDetailItem = props => {
  var titulo = getFriendlyText(props.listKey);
  var item = null;
  if (
    props.listKey == '1' ||
    props.listKey == '2' ||
    props.listKey == '3' ||
    props.listKey == 'evangelio'
  ) {
    var swipeoutBtns = [
      {
        text: 'Limpiar',
        type: 'delete',
        onPress: () => {
          props.cleanItem(props.listName, props.listKey);
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
              onChangeText={text =>
                props.updateItem(props.listName, props.listKey, text)}
              value={props.listText}
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
    item = (
      <Swipeout right={null} backgroundColor="white" autoClose={true}>
        <ListItem icon>
          <Left>
            <Icon name="person" />
          </Left>
          <Body>
            <Input
              onChangeText={text =>
                props.updateItem(props.listName, props.listKey, text)}
              value={props.listText}
              clearButtonMode="always"
              autoCorrect={false}
            />
          </Body>
        </ListItem>
      </Swipeout>
    );
  } else {
    var text = props.listText == null ? 'Buscar...' : props.listText.titulo;
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
              <Text>{text}</Text>
            </Button>
          </Body>
          <Right>
            <Icon
              name="open"
              style={{ color: commonTheme.brandPrimary }}
              onPress={() =>
                props.navigation.navigate('SalmoDetail', {
                  salmo: props.listText
                })}
            />
          </Right>
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
    listName: props.listName,
    listKey: props.listKey,
    listText: props.listText
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openSalmoChooser: (list, key) => {
      dispatch(openSalmoChooserDialog(list, key));
    },
    cleanItem: (list, key) => {
      Alert.alert('Falta implementar', key);
    },
    updateItem: (list, key, text) => {
      dispatch(updateListMapText(list, key, text));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListDetailItem);
