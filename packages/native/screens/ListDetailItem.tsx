
import {
  Text,
  Textarea,
  Icon,
  VStack,
  HStack,
  Input,
  Pressable,
  Button,
} from '@gluestack-ui/themed';
import { View } from 'react-native';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import {
  EucaristiaList,
  LibreList,
  PalabraList,
  Song,
  getLocalizedListItem,
} from '@iresucito/core';
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
import { Swipeable } from 'react-native-gesture-handler';
import { useRef } from 'react';
import { SwipeableRightAction } from '../components';
import { config } from '../gluestack-ui.config';

type ListDetailItemNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, 'SongChooser'>,
  StackNavigationProp<ListsStackParamList>
>;

const SongInput = (props: {
  song: Song | null;
  listName: string;
  listKey: keyof LibreList | keyof EucaristiaList | keyof PalabraList | number;
  listKeyIndex?: number;
}) => {
  const { song, listName, listKey, listKeyIndex } = props;
  const navigation = useNavigation<ListDetailItemNavigationProp>();
  const swipeRef = useRef<Swipeable>(null);
  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      rightThreshold={30}
      enabled={song != null}
      renderRightActions={(progress, dragX) => {
        return (
          <View style={{ width: 100, flexDirection: 'row' }}>
            <SwipeableRightAction
              color={config.theme.tokens.colors.rose600}
              progress={progress}
              text={i18n.t('ui.delete')}
              x={100}
              onPress={() => {
                swipeRef.current?.close();
                useListsStore
                  .getState()
                  .setList(listName, listKey, undefined, listKeyIndex);
              }}
            />
          </View>
        );
      }}>
      <HStack p="$2" space="sm" width="100%" alignItems="center">
        <Icon w="10%" as={MusicIcon} color="$info500" />
        <Pressable
          w="80%"
          onPress={() =>
            navigation.navigate('SongChooser', {
              screen: 'Dialog',
              params: {
                target: {
                  listName: listName,
                  listKey: listKey,
                  listKeyIndex: listKeyIndex,
                },
              },
            })
          }>
          <Text>
            {song == null
              ? i18n.t('ui.search placeholder') + '...'
              : song.titulo}
          </Text>
        </Pressable>
        {song != null ? (
          <Button
            w="10%"
            variant="outline"
            onPress={() =>
              navigation.navigate('SongDetail', {
                song,
              })
            }>
            <Icon as={ArrowRight} color="$rose500" />
          </Button>
        ) : null}
      </HStack>
    </Swipeable>
  );
};

const ListDetailItem = (props: {
  listName: any;
  listKey: keyof LibreList | keyof EucaristiaList | keyof PalabraList | number;
  listText: any;
  inputProps?: any;
}) => {
  const navigation = useNavigation<ListDetailItemNavigationProp>();
  const { listName, listKey, listText, inputProps } = props;

  var item: any = null;
  if (
    typeof listKey == 'string' &&
    ['1', '2', '3', 'evangelio'].includes(listKey)
  ) {
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
        <Textarea>
          <Textarea.Input
            onChangeText={(text) => {
              useListsStore.getState().setList(listName, listKey, text);
            }}
            value={listText}
            autoCorrect={false}
            {...inputProps}
          />
        </Textarea>
      </VStack>
    );
  } else if (listKey === 'comunion-pan' || listKey === 'comunion-caliz') {
    // Lista de cantos
    item = listText ? (
      <>
        {listText.map((song, index) => {
          return (
            <SongInput
              key={index}
              song={song}
              listName={listName}
              listKey={listKey}
              listKeyIndex={index}
            />
          );
        })}
        <SongInput
          song={null}
          listName={listName}
          listKey={listKey}
          listKeyIndex={listText.length}
        />
      </>
    ) : (
      <SongInput
        song={null}
        listName={listName}
        listKey={listKey}
        listKeyIndex={0}
      />
    );
  } else {
    // Cualquier otro caso, es un canto
    item = <SongInput song={listText} listName={listName} listKey={listKey} />;
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
