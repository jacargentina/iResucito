import * as React from 'react';
import { useState, useRef } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { VStack, Text, useTheme } from 'native-base';
import { RouteProp, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SwipeableRightAction from '../components/SwipeableRightAction';
import { useLists, useListsStore } from '../hooks';
import i18n from '@iresucito/translations';
import ListDetailItem from './ListDetailItem';

const SwipeableRow = (props: {
  listName: string;
  listKey: string;
  song: any;
}) => {
  const { listName, listKey, song } = props;
  const swipeRef = useRef<Swipeable>(null);
  const { colors } = useTheme();

  return (
    <Swipeable
      ref={swipeRef}
      friction={2}
      rightThreshold={30}
      renderRightActions={(progress, dragX) => {
        return (
          <View style={{ width: 100, flexDirection: 'row' }}>
            <SwipeableRightAction
              color={colors.rose['600']}
              progress={progress}
              text={i18n.t('ui.delete')}
              x={100}
              onPress={() => {
                swipeRef.current?.close();
                Alert.alert(
                  `${i18n.t('ui.delete')} "${song.titulo}"`,
                  i18n.t('ui.delete confirmation'),
                  [
                    {
                      text: i18n.t('ui.delete'),
                      onPress: () => {
                        useListsStore.getState().setList(listName, listKey, undefined);
                      },
                      style: 'destructive',
                    },
                    {
                      text: i18n.t('ui.cancel'),
                      style: 'cancel',
                    },
                  ]
                );
              }}
            />
          </View>
        );
      }}>
      <ListDetailItem listName={listName} listKey={listKey} listText={song} />
    </Swipeable>
  );
};

import type { ListsStackParamList } from '../navigation/ListsNavigator';

type ListDetailRouteProp = RouteProp<ListsStackParamList, 'ListDetail'>;

const ListDetail = () => {
  const { getListForUI } = useLists();
  const [scroll, setScroll] = useState<ScrollView>();
  const [noteFocused, setNoteFocused] = useState(false);
  const route = useRoute<ListDetailRouteProp>();
  const { listName } = route.params;

  const uiList = getListForUI(listName);

  if (uiList.type === 'libre') {
    var items = uiList.items;
    return (
      <>
        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {items.length === 0 && (
            <Text textAlign="center" mt="5">
              {i18n.t('ui.empty songs list')}
            </Text>
          )}
          {items.length > 0 && (
            <VStack p="2">
              {items.map((song, key) => {
                return (
                  <SwipeableRow
                    key={key}
                    listName={listName}
                    listKey={key}
                    song={song}
                  />
                );
              })}
            </VStack>
          )}
        </KeyboardAwareScrollView>
      </>
    );
  }
  /* eslint-disable dot-notation */
  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      innerRef={(ref) => setScroll(ref as unknown as ScrollView)}>
      <VStack p="2">
        <ListDetailItem
          listName={listName}
          listKey="ambiental"
          listText={uiList.ambiental}
        />
        <ListDetailItem
          listName={listName}
          listKey="entrada"
          listText={uiList.entrada}
        />
        <ListDetailItem
          listName={listName}
          listKey="1-monicion"
          listText={uiList['1-monicion']}
        />
        <ListDetailItem
          listName={listName}
          listKey="1"
          listText={uiList['1']}
        />
        {uiList.hasOwnProperty('1-salmo') && (
          <ListDetailItem
            listName={listName}
            listKey="1-salmo"
            listText={uiList['1-salmo']}
          />
        )}
        <ListDetailItem
          listName={listName}
          listKey="2-monicion"
          listText={uiList['2-monicion']}
        />
        <ListDetailItem
          listName={listName}
          listKey="2"
          listText={uiList['2']}
        />
        {uiList.hasOwnProperty('2-salmo') && (
          <ListDetailItem
            listName={listName}
            listKey="2-salmo"
            listText={uiList['2-salmo']}
          />
        )}
        {uiList.hasOwnProperty('3-monicion') && (
          <ListDetailItem
            listName={listName}
            listKey="3-monicion"
            listText={uiList['3-monicion']}
          />
        )}
        {uiList.hasOwnProperty('3') && (
          <ListDetailItem
            listName={listName}
            listKey="3"
            listText={uiList['3']}
          />
        )}
        {uiList.hasOwnProperty('3-salmo') && (
          <ListDetailItem
            listName={listName}
            listKey="3-salmo"
            listText={uiList['3-salmo']}
          />
        )}
        <ListDetailItem
          listName={listName}
          listKey="evangelio-monicion"
          listText={uiList['evangelio-monicion']}
        />
        <ListDetailItem
          listName={listName}
          listKey="evangelio"
          listText={uiList['evangelio']}
        />
        {uiList.hasOwnProperty('oracion-universal') && (
          <ListDetailItem
            listName={listName}
            listKey="oracion-universal"
            listText={uiList['oracion-universal']}
          />
        )}
        {uiList.hasOwnProperty('paz') && (
          <ListDetailItem
            listName={listName}
            listKey="paz"
            listText={uiList['paz']}
          />
        )}
        {uiList.hasOwnProperty('comunion-pan') && (
          <ListDetailItem
            listName={listName}
            listKey="comunion-pan"
            listText={uiList['comunion-pan']}
          />
        )}
        {uiList.hasOwnProperty('comunion-caliz') && (
          <ListDetailItem
            listName={listName}
            listKey="comunion-caliz"
            listText={uiList['comunion-caliz']}
          />
        )}
        <ListDetailItem
          listName={listName}
          listKey="salida"
          listText={uiList.salida}
        />
        {uiList.hasOwnProperty('encargado-pan') && (
          <ListDetailItem
            listName={listName}
            listKey="encargado-pan"
            listText={uiList['encargado-pan']}
          />
        )}
        {uiList.hasOwnProperty('encargado-flores') && (
          <ListDetailItem
            listName={listName}
            listKey="encargado-flores"
            listText={uiList['encargado-flores']}
          />
        )}
        <ListDetailItem
          listName={listName}
          listKey="nota"
          listText={uiList.nota}
          inputProps={{
            onFocus: () => {
              setNoteFocused(true);
            },
            onBlur: () => {
              setNoteFocused(false);
            },
            onContentSizeChange: () => {
              if (noteFocused && scroll) {
                scroll.scrollToEnd();
              }
            },
          }}
        />
      </VStack>
    </KeyboardAwareScrollView>
  );
};

export default ListDetail;
