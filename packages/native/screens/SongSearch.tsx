import * as React from 'react';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import { useNavigation } from '@react-navigation/native';
import {
  Spinner,
  Pressable,
  HStack,
  Center,
  VStack,
  Text,
  Divider,
} from 'native-base';
import { FlashList } from '@shopify/flash-list';
import i18n from '@iresucito/translations';
import { StackNavigationProp } from '@react-navigation/stack';
import { SongsStackParamList } from '../navigation/SongsNavigator';
import { useSettingsStore } from '../hooks';

const Loading = () => {
  return (
    <Center marginTop={10}>
      <Spinner color="rose.500" size="lg" />
      <Text>{i18n.t('ui.loading')}</Text>
    </Center>
  );
};

type SongListNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'SongList'
>;

const SongSearch = () => {
  const { hasHydrated, searchItems } = useSettingsStore();
  const navigation = useNavigation<SongListNavigationProp>();

  useAndroidBackHandler(() => {
    return true;
  });

  if (!hasHydrated) {
    return <Loading />;
  }

  return (
    <FlashList
      data={searchItems}
      keyExtractor={(item, i) => String(i)}
      renderItem={({ item, index }) => {
        const nextItem = searchItems![index + 1];
        if (item.divider) {
          return (
            <Text bold p="2" fontSize="sm" bg="gray.100">
              {i18n.t(item.title_key).toUpperCase()}
            </Text>
          );
        }
        return (
          <Pressable
            onPress={() => {
              navigation.navigate('SongList', item.params as any);
            }}>
            <HStack w="100%" p="2" m="1">
              {item.badge}
              <VStack>
                <Text bold>{i18n.t(item.title_key)}</Text>
                <Text color="muted.500" fontSize="sm">
                  {i18n.t(item.note_key as string)}
                </Text>
              </VStack>
            </HStack>
            {nextItem && !nextItem.divider && <Divider />}
          </Pressable>
        );
      }}
      estimatedItemSize={64}
    />
  );
};

export default SongSearch;
