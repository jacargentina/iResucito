import * as React from 'react';
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  Pressable,
  VStack,
  HStack,
  Icon,
  Text,
  FlatList,
  useDisclose,
  useTheme,
} from 'native-base';
import { Alert, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SwipeableRightAction from '../components/SwipeableRightAction';
import SearchBarView from '../components/SearchBarView';
import { ListForUI, useData } from '../DataContext';
import CallToAction from '../components/CallToAction';
import AddListButton from '../components/AddListButton';
import ChooseListTypeForAdd from '../components/ChooseListTypeForAdd';
import I18n from '@iresucito/translations';

const SwipeableRow = (props: { item: any }) => {
  const data = useData();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { removeList } = data.lists;
  const { item } = props;
  const swipeRef = useRef<Swipeable>(null);

  const listDelete = useCallback(
    (listName: string) => {
      Alert.alert(
        `${I18n.t('ui.delete')} "${listName}"`,
        I18n.t('ui.delete confirmation'),
        [
          {
            text: I18n.t('ui.delete'),
            onPress: () => {
              removeList(listName);
            },
            style: 'destructive',
          },
          {
            text: I18n.t('ui.cancel'),
            style: 'cancel',
          },
        ]
      );
    },
    [removeList]
  );

  const listRename = useCallback(
    (listName: string) => {
      navigation.navigate('ListName', {
        action: 'rename',
        listName: listName,
      });
    },
    [navigation]
  );

  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      rightThreshold={30}
      renderRightActions={(progress, dragX) => {
        return (
          <View style={{ width: 250, flexDirection: 'row' }}>
            <SwipeableRightAction
              color={colors.blue['500']}
              progress={progress}
              text={I18n.t('ui.rename')}
              x={250}
              onPress={() => {
                swipeRef.current?.close();
                listRename(item.name);
              }}
            />
            <SwipeableRightAction
              color={colors.rose['600']}
              progress={progress}
              text={I18n.t('ui.delete')}
              x={125}
              onPress={() => {
                swipeRef.current?.close();
                listDelete(item.name);
              }}
            />
          </View>
        );
      }}>
      <Pressable
        onPress={() => {
          navigation.navigate('ListDetail', {
            listName: item.name,
          });
        }}>
        <HStack
          space={2}
          p="3"
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor="muted.200">
          <Icon
            w="12%"
            as={Ionicons}
            color="rose.500"
            name="bookmark-outline"
          />
          <VStack space={1}>
            <Text bold fontSize="xl">
              {item.name}
            </Text>
            <Text>{item.type}</Text>
          </VStack>
        </HStack>
      </Pressable>
    </Swipeable>
  );
};

const ListScreen = () => {
  const data = useData();
  const navigation = useNavigation();
  const { getListsForUI } = data.lists;
  const [filtered, setFiltered] = useState<ListForUI[]>([]);
  const [filter, setFilter] = useState('');
  const chooser = useDisclose();

  const allLists = useMemo(
    () => getListsForUI(I18n.locale),
    [I18n.locale, getListsForUI]
  );

  useEffect(() => {
    var result = allLists;
    if (filter !== '') {
      result = result.filter((c) => c.name.includes(filter));
    }
    setFiltered(result);
  }, [allLists, filter]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <AddListButton onPress={chooser.onOpen} />,
    });
  });

  if (allLists.length === 0) {
    return (
      <>
        <ChooseListTypeForAdd chooser={chooser} />
        <CallToAction
          icon="bookmarks-outline"
          title={I18n.t('call_to_action_title.add lists')}
          text={I18n.t('call_to_action_text.add lists')}
          buttonHandler={chooser.onOpen}
          buttonText={I18n.t('call_to_action_button.add lists')}
        />
      </>
    );
  }

  return (
    <SearchBarView value={filter} setValue={setFilter}>
      <ChooseListTypeForAdd chooser={chooser} />
      {filtered.length === 0 && (
        <Text textAlign="center" m="5">
          {I18n.t('ui.no lists found')}
        </Text>
      )}
      <FlatList
        data={filtered}
        extraData={I18n.locale}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          return <SwipeableRow item={item} />;
        }}
      />
    </SearchBarView>
  );
};

export default ListScreen;
