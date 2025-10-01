import { useLayoutEffect, useState, useEffect, useRef } from 'react';
import {
  Pressable,
  VStack,
  HStack,
  Icon,
  Text,
  useMedia,
} from '@gluestack-ui/themed';
import { Alert, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable, {
  SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import {
  CallToAction,
  SwipeableRightAction,
  SearchBarView,
  ChooseListTypeForAdd,
} from '../components';
import { useListsStore, useSettingsStore } from '../hooks';
import i18n from '@iresucito/translations';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListsStackParamList } from '../navigation/ListsNavigator';
import { config } from '../config/gluestack-ui.config';
import { BookmarkIcon } from 'lucide-react-native';
import { ListForUI } from '@iresucito/core';
import { HeaderButton } from '../navigation/util';

type ListScreenNavigationProp = StackNavigationProp<
  ListsStackParamList,
  'ListName'
>;

const SwipeableRow = (props: { item: ListForUI }) => {
  const media = useMedia();
  const navigation = useNavigation<ListScreenNavigationProp>();
  const { item } = props;
  const swipeRef = useRef<SwipeableMethods | null>(null);

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        ref={swipeRef}
        friction={2}
        rightThreshold={30}
        renderRightActions={(progress, dragX) => {
          return (
            <View style={{ width: 250, flexDirection: 'row' }}>
              <SwipeableRightAction
                color={config.tokens.colors.blue500}
                progress={progress}
                text={i18n.t('ui.rename')}
                x={250}
                swipeableRef={swipeRef}
                onPress={() => {
                  swipeRef.current?.close();
                  navigation.navigate('ListName', {
                    action: 'rename',
                    listName: item.name,
                  });
                }}
              />
              <SwipeableRightAction
                color={config.tokens.colors.rose600}
                progress={progress}
                text={i18n.t('ui.delete')}
                x={125}
                swipeableRef={swipeRef}
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
          testID={`list-${item.name}`}
          onPress={() => {
            navigation.navigate('ListDetail', {
              listName: item.name,
            });
          }}>
          <HStack
            space="sm"
            p="$3"
            alignItems="center"
            borderBottomWidth={1}
            $light-borderBottomColor="$light200"
            $dark-borderBottomColor="$light600">
            <Icon
              as={BookmarkIcon}
              size={media.md ? 'xxl' : 'xl'}
              color="$rose500"
            />
            <VStack space="xs">
              <Text
                fontWeight="bold"
                fontSize={media.md ? '$4xl' : '$xl'}
                lineHeight={media.md ? '$3xl' : '$xl'}>
                {item.name}
              </Text>
              <Text fontSize={media.md ? '$xl' : undefined}>
                {item.localeType}
              </Text>
            </VStack>
          </HStack>
        </Pressable>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

export const ListScreen = () => {
  const { lists_ui } = useListsStore();
  const { computedLocale } = useSettingsStore();
  const navigation = useNavigation();
  const [filtered, setFiltered] = useState<ListForUI[]>([]);
  const [filter, setFilter] = useState('');
  const [showActionsheet, setShowActionsheet] = useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);

  const ref = useRef(null);

  useScrollToTop(ref);

  useEffect(() => {
    var result = lists_ui;
    if (filter !== '') {
      result = result.filter((c) =>
        c.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    setFiltered(result);
  }, [lists_ui, filter]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButton
          testID="add-list"
          iconName="PlusIcon"
          onPress={() => setShowActionsheet(true)}
        />
      ),
    });
  });

  if (lists_ui.length === 0) {
    return (
      <>
        <ChooseListTypeForAdd isOpen={showActionsheet} onClose={handleClose} />
        <CallToAction
          icon={BookmarkIcon}
          title={i18n.t('call_to_action_title.add lists')}
          text={i18n.t('call_to_action_text.add lists')}
          buttonHandler={() => setShowActionsheet(true)}
          buttonText={i18n.t('call_to_action_button.add lists')}
        />
      </>
    );
  }

  return (
    <SearchBarView
      value={filter}
      setValue={setFilter}
      placeholder={
        i18n.t('ui.search placeholder', { locale: computedLocale }) + '...'
      }>
      <ChooseListTypeForAdd isOpen={showActionsheet} onClose={handleClose} />
      {filtered.length === 0 && (
        <Text textAlign="center" m="$5">
          {i18n.t('ui.no lists found')}
        </Text>
      )}
      <FlashList
        ref={ref}
        data={filtered}
        extraData={i18n.locale}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => {
          return <SwipeableRow item={item} />;
        }}
      />
    </SearchBarView>
  );
};
