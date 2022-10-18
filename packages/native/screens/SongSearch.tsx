import * as React from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { useNavigation } from '@react-navigation/native';
import {
  Spinner,
  Pressable,
  HStack,
  Center,
  VStack,
  Text,
  Divider,
  FlatList,
} from 'native-base';
import { useData } from '../DataContext';
import I18n from '@iresucito/translations';

const Loading = () => {
  return (
    <Center marginTop={10}>
      <Spinner color="rose.500" size="lg" />
      <Text>{I18n.t('ui.loading')}</Text>
    </Center>
  );
};

const SongSearch = () => {
  const data = useData();
  const navigation = useNavigation();
  const { initialized, searchItems } = data.search;

  if (!initialized) {
    return <Loading />;
  }

  return (
    <AndroidBackHandler onBackPress={() => true}>
      <FlatList
        data={searchItems}
        keyExtractor={(item, i) => String(i)}
        renderItem={({ item, index }) => {
          const nextItem = searchItems[index + 1];
          if (item.divider) {
            return (
              <Text bold p="2" fontSize="sm" bg="gray.100">
                {I18n.t(item.title_key).toUpperCase()}
              </Text>
            );
          }
          return (
            <Pressable
              onPress={() => {
                navigation.navigate(item.route, item.params);
              }}
            >
              <HStack w="100%" p="2" m="1">
                {item.badge}
                <VStack>
                  <Text>{I18n.t(item.title_key)}</Text>
                  <Text color="muted.500" fontSize="sm">
                    {I18n.t(item.note_key)}
                  </Text>
                </VStack>
              </HStack>
              {nextItem && !nextItem.divider && <Divider />}
            </Pressable>
          );
        }}
      />
    </AndroidBackHandler>
  );
};

export default SongSearch;
