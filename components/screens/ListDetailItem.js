import React from 'react';
import { connect } from 'react-redux';
import {
  Text,
  Icon,
  ListItem,
  Left,
  Body,
  Input,
  Right,
  Separator
} from 'native-base';
import { View, TextInput } from 'react-native';
import { openChooserDialog, saveLists, updateListMapText } from '../actions';
import { getFriendlyText } from '../util';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';

const ListDetailItem = props => {
  var titulo = getFriendlyText(props.listKey);
  var item = null;
  if (
    props.listKey == '1' ||
    props.listKey == '2' ||
    props.listKey == '3' ||
    props.listKey == 'evangelio'
  ) {
    item = (
      <ListItem icon last>
        <Left>
          <Icon name="book" />
        </Left>
        <Body>
          <Input
            onChangeText={text =>
              props.updateItem(props.listName, props.listKey, text)
            }
            value={props.listText}
            clearButtonMode="always"
            autoCorrect={false}
          />
        </Body>
      </ListItem>
    );
  } else if (
    props.listKey.includes('monicion') ||
    props.listKey.includes('ambiental')
  ) {
    item = (
      <ListItem icon last>
        <Left>
          <Icon name="person" />
        </Left>
        <Body>
          <Input
            onChangeText={text =>
              props.updateItem(props.listName, props.listKey, text)
            }
            value={props.listText}
            clearButtonMode="always"
            autoCorrect={false}
          />
        </Body>
        <Right>
          <Icon
            name="search"
            style={{
              color: commonTheme.brandPrimary,
              width: 40,
              height: 40,
              fontSize: 30
            }}
            onPress={() =>
              props.openChooser('Contact', props.listName, props.listKey)
            }
          />
        </Right>
      </ListItem>
    );
  } else if (props.listKey == 'nota') {
    item = (
      <ListItem>
        <Body>
          <TextInput
            multiline
            onChangeText={text =>
              props.updateItem(props.listName, props.listKey, text)
            }
            value={props.listText}
            autoCorrect={false}
          />
        </Body>
      </ListItem>
    );
  } else {
    var text =
      props.listText == null
        ? I18n.t('ui.search placeholder') + '...'
        : props.listText.titulo;
    var navigateSalmo =
      props.listText != null ? (
        <Right>
          <Icon
            name="open"
            style={{
              color: commonTheme.brandPrimary,
              width: 40,
              height: 40,
              fontSize: 30
            }}
            onPress={() =>
              props.navigation.navigate('SalmoDetail', {
                salmo: props.listText
              })
            }
          />
        </Right>
      ) : null;
    item = (
      <ListItem
        icon
        last
        button
        onPress={() =>
          props.openChooser('Salmo', props.listName, props.listKey)
        }>
        <Left>
          <Icon name="musical-notes" />
        </Left>
        <Body>
          <Text numberOfLines={1}>{text}</Text>
        </Body>
        {navigateSalmo}
      </ListItem>
    );
  }
  return (
    <View>
      <Separator bordered>
        <Text>{titulo}</Text>
      </Separator>
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
    openChooser: (type, list, key) => {
      dispatch(openChooserDialog(type, list, key));
    },
    updateItem: (list, key, text) => {
      dispatch(updateListMapText(list, key, text));
      dispatch(saveLists());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListDetailItem);
