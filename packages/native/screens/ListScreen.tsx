import * as React from 'react';
import { useState, useMemo, useEffect, useRef } from 'react';
import {
  Pressable,
  VStack,
  HStack,
  Icon,
  Text,
  useDisclose,
  useTheme,
} from 'native-base';
import { Alert, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import SwipeableRightAction from '../components/SwipeableRightAction';
import SearchBarView from '../components/SearchBarView';
import { ListForUI, useListsStore, useSettingsStore } from '../hooks';
import CallToAction from '../components/CallToAction';
import AddListButton from '../components/AddListButton';
import ChooseListTypeForAdd from '../components/ChooseListTypeForAdd';
import i18n from '@iresucito/translations';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListsStackParamList } from '../navigation/ListsNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../navigation/RootNavigator';

type ListScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootStackParamList, 'ListName'>,
  StackNavigationProp<ListsStackParamList>
>;

const SwipeableRow = (props: { item: ListForUI }) => {
  const navigation = useNavigation<ListScreenNavigationProp>();
  const { colors } = useTheme();
  const { item } = props;
  const swipeRef = useRef<Swipeable>(null);

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
              text={i18n.t('ui.rename')}
              x={250}
              onPress={() => {
                swipeRef.current?.close();
                navigation.navigate('ListName', {
                  action: 'rename',
                  listName: item.name,
                });
              }}
            />
            <SwipeableRightAction
              color={colors.rose['600']}
              progress={progress}
              text={i18n.t('ui.delete')}
              x={125}
              onPress={() => {
                swipeRef.current?.close();
                Alert.alert(
                  `${i18n.t('ui.delete')} "${item.name}"`,
                  i18n.t('ui.delete confirmation'),
                  [
                    {
                      text: i18n.t('ui.delete'),
                      onPress: () => {
                        useListsStore.getState().remove(item.name);
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
            as={Ionicons}
            size="3xl"
            color="rose.500"
            name="bookmark-outline"
          />
          <VStack space={1}>
            <Text bold fontSize="xl">
              {item.name}
            </Text>
            <Text>{item.localeType}</Text>
          </VStack>
        </HStack>
      </Pressable>
    </Swipeable>
  );
};

const ListScreen = () => {
  const { lists_forui } = useListsStore();
  const { computedLocale } = useSettingsStore();
  const navigation = useNavigation();
  const [filtered, setFiltered] = useState<ListForUI[]>([]);
  const [filter, setFilter] = useState('');
  const chooser = useDisclose();

  useEffect(() => {
    var result = lists_forui;
    if (filter !== '') {
      result = result.filter((c) => c.name.includes(filter));
    }
    setFiltered(result);
  }, [lists_forui, filter]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <AddListButton onPress={chooser.onOpen} />,
    });
  });

  if (lists_forui.length === 0) {
    return (
      <>
        <ChooseListTypeForAdd chooser={chooser} />
        <CallToAction
          icon="bookmarks-outline"
          title={i18n.t('call_to_action_title.add lists')}
          text={i18n.t('call_to_action_text.add lists')}
          buttonHandler={chooser.onOpen}
          buttonText={i18n.t('call_to_action_button.add lists')}
        />
      </>
    );
  }

  return (
    <SearchBarView value={filter} setValue={setFilter} placeholder={i18n.t("ui.search placeholder", { locale: computedLocale }) + '...'}>
      <ChooseListTypeForAdd chooser={chooser} />
      {filtered.length === 0 && (
        <Text textAlign="center" m="5">
          {i18n.t('ui.no lists found')}
        </Text>
      )}
      <FlashList
        data={filtered}
        extraData={i18n.locale}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          return <SwipeableRow item={item} />;
        }}
        estimatedItemSize={90}
      />
    </SearchBarView>
  );
};

export default ListScreen;
