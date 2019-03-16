// @flow
import React, { useContext } from 'react';
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
import { DataContext } from '../DataContext';
import { getFriendlyText } from '../util';
import commonTheme from '../native-base-theme/variables/platform';
import I18n from '../translations';

const ListDetailItem = (props: any) => {
  const data = useContext(DataContext);
  const { setList, save } = data.lists;
  const { show: showContactDialog } = data.contactChooserDialog;
  const { show: showSalmoDialog } = data.salmoChooserDialog;

  var item = null;
  if (
    props.listKey === '1' ||
    props.listKey === '2' ||
    props.listKey === '3' ||
    props.listKey === 'evangelio'
  ) {
    item = (
      <ListItem icon last>
        <Left>
          <Icon name="book" />
        </Left>
        <Body>
          <Input
            onChangeText={text => {
              setList(props.listName, props.listKey, text);
              save();
            }}
            value={props.listText}
            clearButtonMode="always"
            autoCorrect={false}
          />
        </Body>
      </ListItem>
    );
  } else if (
    typeof props.listKey == 'string' &&
    (props.listKey.includes('monicion') || props.listKey.includes('ambiental'))
  ) {
    item = (
      <ListItem icon last>
        <Left>
          <Icon name="person" />
        </Left>
        <Body>
          <Input
            onChangeText={text => {
              setList(props.listName, props.listKey, text);
              save();
            }}
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
            onPress={() => showContactDialog(props.listName, props.listKey)}
          />
        </Right>
      </ListItem>
    );
  } else if (props.listKey === 'nota') {
    item = (
      <ListItem>
        <Body>
          <TextInput
            multiline
            onChangeText={text => {
              setList(props.listName, props.listKey, text);
              save();
            }}
            value={props.listText}
            autoCorrect={false}
          />
        </Body>
      </ListItem>
    );
  } else {
    // Cualquier otro caso, es un canto
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
        onPress={() => showSalmoDialog(props.listName, props.listKey)}>
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
  // Solo las claves de tipo string, llevan los titulos (eucaristia, palabra)
  if (typeof props.listKey === 'string') {
    var friendlyText = getFriendlyText(props.listKey);
    var separator = (
      <Separator bordered>
        <Text>{friendlyText}</Text>
      </Separator>
    );
  }
  return (
    <View>
      {separator}
      {item}
    </View>
  );
};

export default ListDetailItem;