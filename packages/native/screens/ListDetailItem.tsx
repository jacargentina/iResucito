import * as React from 'react';
import {
  Text,
  TextArea,
  Icon,
  VStack,
  HStack,
  Input,
  Pressable,
  Button,
} from '../gluestack';
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
import {
  ArrowRight,
  BookIcon,
  MusicIcon,
  SearchIcon,
  UserIcon,
} from 'lucide-react-native';

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
      <VStack p="$2">
        <HStack space="sm" width="100%" alignItems="center">
          <Icon w="10%" as={BookIcon} color="$info500" />
          <Input w="90%">
            <Input.Input
              onChangeText={(text) => {
                useListsStore.getState().setList(listName, listKey, text);
              }}
              value={listText}
              clearButtonMode="always"
              autoCorrect={false}
              {...inputProps}
            />
          </Input>
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
      <HStack p="$2" space="sm" width="100%" alignItems="center">
        <Icon w="10%" as={UserIcon} color="$info500" />
        <Input w="80%">
          <Input.Input
            onChangeText={(text) => {
              useListsStore.getState().setList(listName, listKey, text);
            }}
            value={listText}
            clearButtonMode="always"
            autoCorrect={false}
            {...inputProps}
          />
        </Input>
        <Button
          w="10%"
          variant="outline"
          onPress={() =>
            navigation.navigate('ContactChooser', {
              target: { listName: listName, listKey: listKey },
            })
          }>
          <Icon as={SearchIcon} color="$rose500" />
        </Button>
      </HStack>
    );
  } else if (listKey === 'nota') {
    item = (
      <VStack p="$2" pb="$8">
        <TextArea>
          <TextArea.Input
            onChangeText={(text) => {
              useListsStore.getState().setList(listName, listKey, text);
            }}
            value={listText}
            autoCorrect={false}
            {...inputProps}
          />
        </TextArea>
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
        <Button
          w="10%"
          variant="outline"
          onPress={() =>
            navigation.navigate('SongDetail', {
              song: listText,
            })
          }>
          <Icon as={ArrowRight} color="$rose500" />
        </Button>
      ) : null;
    item = (
      <HStack p="$2" space="sm" width="100%" alignItems="center">
        <Icon w="10%" as={MusicIcon} color="$info500" />
        <Pressable
          w="80%"
          onPress={() =>
            navigation.navigate('SongChooser', {
              screen: 'Dialog',
              params: {
                target: { listName: listName, listKey: listKey },
              },
            })
          }>
          <Text>{text}</Text>
        </Pressable>
        {navigateSalmo}
      </HStack>
    );
  }

  var separator: any = undefined;

  // Solo las claves de tipo string, llevan los titulos (eucaristia, palabra)
  if (typeof listKey === 'string') {
    var friendlyText = getLocalizedListItem(listKey).toUpperCase();
    separator = (
      <Text fontWeight="bold" p="$2" fontSize="$sm" bg="$gray100">
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
