// @flow
import * as React from 'react';
import { useContext, useState, useMemo, useEffect } from 'react';
import {
  Pressable,
  VStack,
  HStack,
  Icon,
  Text,
  FlatList,
  useDisclose,
} from 'native-base';
import { Alert, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Swipeout from 'react-native-swipeout';
import SearchBarView from '../components/SearchBarView';
import { DataContext } from '../DataContext';
import CallToAction from '../components/CallToAction';
import AddListButton from '../components/AddListButton';
import ChooseListTypeForAdd from '../components/ChooseListTypeForAdd';
import I18n from '../../translations';

const ListScreen = (props: any): React.Node => {
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const { getListsForUI, removeList } = data.lists;
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState('');
  const chooser = useDisclose();

  const allLists = useMemo(
    () => getListsForUI(data.localeReal),
    [data.localeReal, getListsForUI]
  );

  useEffect(() => {
    var result = allLists;
    if (filter !== '') {
      result = result.filter((c) => c.name.includes(filter));
    }
    setFiltered(result);
  }, [allLists, filter]);

  const listDelete = (listName) => {
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
  };

  const listRename = (listName) => {
    navigation.navigate('ListName', {
      action: 'rename',
      listName: listName,
    });
  };

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
          var swipeoutBtns = [
            {
              text: I18n.t('ui.rename'),
              type: 'primary',
              onPress: () => {
                listRename(item.name);
              },
            },
            {
              text: I18n.t('ui.delete'),
              type: Platform.OS === 'ios' ? 'delete' : 'default',
              backgroundColor: Platform.OS === 'android' ? '#e57373' : null,
              onPress: () => {
                listDelete(item.name);
              },
            },
          ];
          return (
            <Swipeout
              right={swipeoutBtns}
              backgroundColor="white"
              autoClose={true}>
              <Pressable
                onPress={() => {
                  navigation.navigate('ListDetail', {
                    listName: item.name,
                  });
                }}>
                <HStack
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
            </Swipeout>
          );
        }}
      />
    </SearchBarView>
  );
};

export default ListScreen;
