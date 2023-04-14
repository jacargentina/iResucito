import * as React from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  useNavigation,
  useRoute,
  useIsFocused,
  RouteProp,
} from '@react-navigation/native';
import { Keyboard, View } from 'react-native';
import { Text, Spinner, useDisclose } from 'native-base';
import { FlashList } from '@shopify/flash-list';
import SearchBarView from '../components/SearchBarView';
import ExportToPdfButton from '../components/ExportToPdfButton';
import ChoosePdfTypeForExport from '../components/ChoosePdfTypeForExport';
import i18n from '@iresucito/translations';
import { useSongsMeta } from '../hooks';
import SongListItem from './SongListItem';
import { SongsStackParamList } from '../navigation/SongsNavigator';
import { Song } from '@iresucito/core';
import { StackNavigationProp } from '@react-navigation/stack';

type SongListRouteProp = RouteProp<SongsStackParamList, 'SongList'>;

type SongDetailNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'SongDetail'
>;

type IsLoading = { isLoading: boolean; text: string };

const SongList = (props: { viewButton?: boolean; filter?: any; sort?: any; onPress?: any }) => {
  const listRef = useRef<any>();
  const { songs, setSongSetting } = useSongsMeta();
  const navigation = useNavigation<SongDetailNavigationProp>();
  const route = useRoute<SongListRouteProp>();
  const isFocused = useIsFocused();
  const chooser = useDisclose();
  const { viewButton } = props;
  const [totalText, setTotalText] = useState(i18n.t('ui.loading'));
  const [loading, setLoading] = useState<IsLoading>({ isLoading: false, text: '' });
  const [showSalmosBadge, setShowSalmosBadge] = useState<boolean>();
  const [textFilter, setTextFilter] = useState('');
  const [search, setSearch] = useState<Song[]>([]);

  useEffect(() => {
    if (songs) {
      const navFilter = route?.params?.filter ?? props.filter;
      var result = songs;
      if (navFilter) {
        for (var name in navFilter) {
          result = result.filter((s) => s[name] === navFilter[name]);
        }
      }
      if (textFilter) {
        result = result.filter((s) => {
          return (
            s.nombre.toLowerCase().includes(textFilter.toLowerCase()) ||
            s.fullText.toLowerCase().includes(textFilter.toLowerCase())
          );
        });
      }
      const navSort = route?.params?.sort ?? props.sort;
      if (navSort) {
        result = result.sort(navSort);
      }
      setShowSalmosBadge(
        navFilter == null || !navFilter.hasOwnProperty('stage')
      );
      setSearch(result);
      if (result.length > 0) {
        setTotalText(i18n.t('ui.list total songs', { total: result.length }));
      } else {
        setTotalText(i18n.t('ui.no songs found'));
      }
    }
  }, [
    route?.params?.filter,
    props.filter,
    route?.params?.sort,
    props.sort,
    textFilter,
    songs,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ExportToPdfButton onPress={chooser.onOpen} />,
    });
  }, [navigation, chooser]);

  useEffect(() => {
    if (search.length > 0 && isFocused && textFilter && listRef.current) {
      listRef.current.scrollToIndex({
        index: 0,
        animated: true,
        viewOffset: 0,
        viewPosition: 1,
      });
    }
  }, [search, isFocused, textFilter]);

  const onPress = (song: Song) => {
    if (props.onPress) {
      props.onPress(song);
    } else {
      navigation.navigate('SongDetail', { song: song });
    }
  };

  if (loading.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
        <Spinner size='lg' />
        <Text color="muted.500" style={{ textAlign: 'center' }}>
          {loading.text}
        </Text>
      </View>
    );
  }

  return (
    <SearchBarView value={textFilter} setValue={setTextFilter}>
      <ChoosePdfTypeForExport chooser={chooser} setLoading={setLoading} />
      <Text bold p="2" px="4" bg="gray.100" color="muted.500">
        {totalText}
      </Text>
      <FlashList
        ref={listRef}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        keyboardShouldPersistTaps="always"
        data={search}
        estimatedItemSize={98}
        renderItem={({ item }) => {
          return (
            <SongListItem
              song={item}
              showBadge={showSalmosBadge}
              onPress={onPress}
              viewButton={viewButton || false}
              highlight={textFilter}
              setSongSetting={setSongSetting}
            />
          );
        }}
      />
    </SearchBarView>
  );
};

export default SongList;
