import * as React from 'react';
import {
  Text,
  TextArea,
  Icon,
  VStack,
  HStack,
  Input,
  Pressable,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { getLocalizedListItem } from '@iresucito/core';
import i18n from '@iresucito/translations';
import { useListsStore } from '../hooks';
import { RootStackParamList } from '../navigation/RootNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListsStackParamList } from '../navigation/ListsNavigator';

type ListDetailItemNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, 'SongChooser'>,
  StackNavigationProp<ListsStackParamList>
>;

const ListDetailItem = (props: {
  listName: any;
  listKey: any;
  listText: any;
  inputProps?: any;
}) => {
  const navigation = useNavigation<ListDetailItemNavigationProp>();
  const { listName, listKey, listText, inputProps } = props;

  var item: any = null;
  if (['1', '2', '3', 'evangelio'].includes(listKey)) {
    item = (
      <VStack p="2">
        <HStack space={1} alignItems="center">
          <Icon w="10%" size="sm" as={Ionicons} name="book" color="info.500" />
          <Input
            p="2"
            w="90%"
            onChangeText={(text) => {
              useListsStore.getState().setList(listName, listKey, text);
            }}
            value={listText}
            clearButtonMode="always"
            autoCorrect={false}
            {...inputProps}
          />
        </HStack>
      </VStack>
    );
  } else if (
    typeof listKey === 'string' &&
    (listKey.includes('monicion') ||
      listKey.includes('ambiental') ||
      listKey.includes('oracion') ||
      listKey.includes('encargado'))
  ) {
    item = (
      <VStack p="2">
        <HStack space={1} alignItems="center">
          <Icon
            w="10%"
            as={Ionicons}
            size="md"
            name="person"
            color="info.500"
          />
          <Input
            p="2"
            w="85%"
            onChangeText={(text) => {
              useListsStore.getState().setList(listName, listKey, text);
            }}
            value={listText}
            clearButtonMode="always"
            autoCorrect={false}
            {...inputProps}
          />
          <Icon
            as={Ionicons}
            size="md"
            color="rose.500"
            name="search-outline"
            onPress={() =>
              navigation.navigate('ContactChooser', {
                target: { listName: listName, listKey: listKey },
              })
            }
          />
        </HStack>
      </VStack>
    );
  } else if (listKey === 'nota') {
    item = (
      <VStack p="2">
        <TextArea
          onChangeText={(text) => {
            useListsStore.getState().setList(listName, listKey, text);
          }}
          value={listText}
          autoCorrect={false}
          {...inputProps}
        />
      </VStack>
    );
  } else {
    // Cualquier otro caso, es un canto
    var text =
      listText == null
        ? i18n.t('ui.search placeholder') + '...'
        : listText.titulo;
    var navigateSalmo =
      listText != null ? (
        <Icon
          as={Ionicons}
          size="md"
          color="rose.500"
          name="open-outline"
          onPress={() =>
            navigation.navigate('SongDetail', {
              song: listText,
            })
          }
        />
      ) : null;
    item = (
      <Pressable
        p="2"
        onPress={() =>
          navigation.navigate('SongChooser', {
            screen: 'Dialog',
            params: {
              target: { listName: listName, listKey: listKey },
            },
          })
        }>
        <HStack space={1} alignItems="center">
          <Icon
            w="10%"
            as={Ionicons}
            size="md"
            name="musical-notes"
            color="info.500"
          />
          <Text w="85%" noOfLines={1}>
            {text}
          </Text>
          {navigateSalmo}
        </HStack>
      </Pressable>
    );
  }

  var separator: any = undefined;

  // Solo las claves de tipo string, llevan los titulos (eucaristia, palabra)
  if (typeof listKey === 'string') {
    var friendlyText = getLocalizedListItem(listKey).toUpperCase();
    separator = (
      <Text bold p="2" fontSize="sm" bg="gray.100">
        {friendlyText}
      </Text>
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
