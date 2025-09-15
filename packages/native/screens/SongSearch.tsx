import { useBackHandler } from '../useBackHandler';
import { useNavigation, useScrollToTop } from '@react-navigation/native';
import {
  Spinner,
  Pressable,
  HStack,
  Center,
  VStack,
  Text,
  Divider,
} from '@gluestack-ui/themed';
import { FlashList } from '@shopify/flash-list';
import i18n from '@iresucito/translations';
import { StackNavigationProp } from '@react-navigation/stack';
import { SongsStackParamList } from '../navigation/SongsNavigator';
import { useSettingsStore } from '../hooks';
import { useRef } from 'react';
import { DismissableBottom } from '../components';

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

  useBackHandler(() => {
    return true;
  });

  if (!hasHydrated) {
    return <Loading />;
  }

  return (
    <DismissableBottom>
      <FlashList
        ref={ref}
        data={searchItems}
        keyExtractor={(item, i) => String(i)}
        renderItem={({ item, index }) => {
          const nextItem = searchItems![index + 1];
          if (item.divider) {
            return (
              <Text
                fontWeight="bold"
                $dark-bg="$backgroundDark800"
                $light-bg="$backgroundDark100"
                sx={{
                  '@base': {
                    p: '$2',
                    fontSize: '$sm',
                  },
                  '@md': {
                    p: '$3',
                    fontSize: '$xl',
                  },
                }}>
                {i18n.t(item.title_key).toUpperCase()}
              </Text>
            );
          }
          return (
            <Pressable
              testID={item.title_key}
              onPress={() => {
                navigation.navigate('SongList', item.params as any);
              }}>
              <HStack
                w="100%"
                sx={{
                  '@base': {
                    p: '$2',
                    m: '$1',
                  },
                  '@md': {
                    p: '$3',
                    m: '$2',
                  },
                }}>
                {item.badge}
                <VStack>
                  <Text
                    fontWeight="bold"
                    sx={{
                      '@md': {
                        fontSize: '$2xl',
                      },
                    }}>
                    {i18n.t(item.title_key)}
                  </Text>
                  <Text
                    sx={{
                      '@base': {
                        fontSize: '$sm',
                      },
                      '@md': {
                        fontSize: '$lg',
                      },
                    }}>
                    {i18n.t(item.note_key as string)}
                  </Text>
                </VStack>
              </HStack>
              {nextItem && !nextItem.divider && <Divider />}
            </Pressable>
          );
        }}
      />
    </DismissableBottom>
  );
};
