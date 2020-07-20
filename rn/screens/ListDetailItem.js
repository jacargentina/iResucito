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
  Separator,
} from 'native-base';
import { View, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DataContext } from '../DataContext';
import { getLocalizedListItem } from '../../common';
import commonTheme from '../native-base-theme/variables/platform';
import I18n from '../../translations';

const ListDetailItem = (props: any) => {
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const { setList } = data.lists;
  const { listName, listKey, listText, inputProps } = props;

  var item = null;
  if (['1', '2', '3', 'evangelio'].includes(listKey)) {
    item = (
      <ListItem icon last>
        <Left>
          <Icon
            name="book"
            type="FontAwesome"
            style={{ color: commonTheme.brandInfo }}
          />
        </Left>
        <Body>
          <Input
            onChangeText={(text) => {
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
    typeof listKey === 'string' &&
    (listKey.includes('monicion') ||
      listKey.includes('ambiental') ||
      listKey.includes('oracion') ||
      listKey.includes('encargado'))
  ) {
    item = (
      <ListItem icon last>
        <Left>
          <Icon
            name="user"
            type="FontAwesome"
            style={{ color: commonTheme.brandInfo }}
          />
        </Left>
        <Body>
          <Input
            onChangeText={(text) => {
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
            type="FontAwesome"
            style={{
              color: commonTheme.brandPrimary,
              width: 40,
              height: 40,
              fontSize: 30,
            }}
            onPress={() =>
              navigation.navigate('ContactChooser', {
                target: { listName: listName, listKey: listKey },
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
            onChangeText={(text) => {
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
            name="folder-open"
            type="FontAwesome"
            style={{
              color: commonTheme.brandPrimary,
              width: 40,
              height: 40,
              fontSize: 30,
            }}
            onPress={() =>
              navigation.navigate('SongDetail', {
                song: listText,
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
          navigation.navigate('SongChooser', {
            screen: 'Dialog',
            params: {
              target: { listName: listName, listKey: listKey },
            },
          })
        }>
        <Left>
          <Icon
            name="music"
            type="FontAwesome"
            style={{ color: commonTheme.brandInfo }}
          />
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
    var friendlyText = getLocalizedListItem(listKey).toUpperCase();
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
