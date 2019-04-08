// @flow
import React, { useContext } from 'react';
import { withNavigation } from 'react-navigation';
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
  const { navigation } = props;
  const { setList } = data.lists;
  const { listName, listKey, listText, inputProps } = props;

  var item = null;
  if (['1', '2', '3', 'evangelio'].includes(listKey)) {
    item = (
      <ListItem icon last>
        <Left>
          <Icon name="book" style={{ color: commonTheme.brandInfo }} />
        </Left>
        <Body>
          <Input
            onChangeText={text => {
              setList(listName, listKey, text);
            }}
            value={listText}
            clearButtonMode="always"
            autoCorrect={false}
            {...inputProps}
          />
        </Body>
      </ListItem>
    );
  } else if (
    typeof listKey == 'string' &&
    (listKey.includes('monicion') || listKey.includes('ambiental'))
  ) {
    item = (
      <ListItem icon last>
        <Left>
          <Icon name="person" style={{ color: commonTheme.brandInfo }} />
        </Left>
        <Body>
          <Input
            onChangeText={text => {
              setList(listName, listKey, text);
            }}
            value={listText}
            clearButtonMode="always"
            autoCorrect={false}
            {...inputProps}
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
              navigation.navigate('ContactChooser', {
                target: { listName: listName, listKey: listKey }
              })
            }
          />
        </Right>
      </ListItem>
    );
  } else if (listKey === 'nota') {
    item = (
      <ListItem>
        <Body>
          <TextInput
            style={{ fontSize: 18 }}
            multiline
            onChangeText={text => {
              setList(listName, listKey, text);
            }}
            value={listText}
            autoCorrect={false}
            {...inputProps}
          />
        </Body>
      </ListItem>
    );
  } else {
    // Cualquier otro caso, es un canto
    var text =
      listText == null
        ? I18n.t('ui.search placeholder') + '...'
        : listText.titulo;
    var navigateSalmo =
      listText != null ? (
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
              navigation.navigate('SongDetail', {
                salmo: listText
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
          navigation.navigate('SalmoChooser', {
            target: { listName: listName, listKey: listKey }
          })
        }>
        <Left>
          <Icon name="musical-notes" style={{ color: commonTheme.brandInfo }} />
        </Left>
        <Body>
          <Text numberOfLines={1}>{text}</Text>
        </Body>
        {navigateSalmo}
      </ListItem>
    );
  }
  // Solo las claves de tipo string, llevan los titulos (eucaristia, palabra)
  if (typeof listKey === 'string') {
    var friendlyText = getFriendlyText(listKey);
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

export default withNavigation(ListDetailItem);
