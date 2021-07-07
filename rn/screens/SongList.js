// @flow
import * as React from 'react';
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  useNavigation,
  useRoute,
  useIsFocused,
} from '@react-navigation/native';
import { FlatList, Keyboard, View } from 'react-native';
import { Text, Spinner } from 'native-base';
import SearchBarView from '../components/SearchBarView';
import I18n from '../../translations';
import { DataContext } from '../DataContext';
import SongListItem from './SongListItem';

const SongList = (props: any): React.Node => {
  const listRef = useRef<any>();
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const { viewButton } = props;
  const [totalText, setTotalText] = useState(I18n.t('ui.loading'));
  const { songs } = data.songsMeta;
  const [loading] = data.loading;
  const [showSalmosBadge, setShowSalmosBadge] = useState();
  const [textFilter, setTextFilter] = useState('');
  const [search, setSearch] = useState();

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
        setTotalText(I18n.t('ui.list total songs', { total: result.length }));
      } else {
        setTotalText(I18n.t('ui.no songs found'));
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
    if (textFilter && search && search.length > 0 && isFocused) {
      if (listRef.current) {
        listRef.current.scrollToIndex({
          index: 0,
          animated: true,
          viewOffset: 0,
          viewPosition: 1,
        });
      }
    }
  }, [textFilter, search, isFocused, totalText]);

  const onPress = (song) => {
    if (props.onPress) {
      props.onPress(song);
    } else {
      navigation.navigate('SongDetail', { song: song });
    }
  };

  if (loading.isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <Spinner style={{ flex: 3 }} />
        <Text color="muted.300" style={{ flex: 1, textAlign: 'center' }}>
          {loading.text}
        </Text>
      </View>
    );
  }

  return (
    <SearchBarView value={textFilter} setValue={setTextFilter}>
      <Text bold p="2" my="2" bg="gray.100" color="muted.500">
        {totalText}
      </Text>
      <FlatList
        ref={listRef}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        keyboardShouldPersistTaps="always"
        data={search || []}
        renderItem={({ item }) => {
          return (
            <SongListItem
              key={item.nombre}
              showBadge={showSalmosBadge}
              songKey={item.key}
              onPress={onPress}
              viewButton={viewButton}
              highlight={textFilter}
            />
          );
        }}
      />
    </SearchBarView>
  );
};

export default SongList;
