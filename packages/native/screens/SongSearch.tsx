import * as React from 'react';
import { useAndroidBackHandler } from 'react-navigation-backhandler';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import {
  Spinner,
  Pressable,
  HStack,
  Center,
  VStack,
  Text,
  Divider,
} from '../gluestack';
import { FlashList } from '@shopify/flash-list';
import i18n from '@iresucito/translations';
import { StackNavigationProp } from '@react-navigation/stack';
import { SongsStackParamList } from '../navigation';
import { useSettingsStore } from '../hooks';
import { useRef } from 'react';

const Loading = () => {
  return (
    <Center marginTop={10}>
      <Spinner
        color="$rose500"
        // @ts-ignore
        size="large"
      />
      <Text>{i18n.t('ui.loading')}</Text>
    </Center>
  );
};

type SongListNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'SongList'
>;

export const SongSearch = () => {
  const { hasHydrated, searchItems } = useSettingsStore();
  const navigation = useNavigation<SongListNavigationProp>();
  const ref = useRef(null);

  useScrollToTop(ref);

  useAndroidBackHandler(() => {
    return true;
  });

  if (!hasHydrated) {
    return <Loading />;
  }

  return (
    <FlashList
      ref={ref}
      data={searchItems}
      keyExtractor={(item, i) => String(i)}
      renderItem={({ item, index }) => {
        const nextItem = searchItems![index + 1];
        if (item.divider) {
          return (
            <Text fontWeight="bold" p="$2" fontSize="$sm" bg="$gray100">
              {i18n.t(item.title_key).toUpperCase()}
            </Text>
          );
        }
        return (
          <Pressable
            onPress={() => {
              navigation.navigate('SongList', item.params as any);
            }}>
            <HStack w="100%" p="$2" m="$1">
              {item.badge}
              <VStack>
                <Text fontWeight="bold">{i18n.t(item.title_key)}</Text>
                <Text color="$muted500" fontSize="$sm">
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
