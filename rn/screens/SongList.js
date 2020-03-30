// @flow
import React, {
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
import { Text, ListItem, Spinner } from 'native-base';
import SearchBarView from './SearchBarView';
import SongListItem from './SongListItem';
import I18n from '../../translations';
import { DataContext } from '../DataContext';
import commonTheme from '../native-base-theme/variables/platform';

const SongList = (props: any) => {
  const listRef = useRef<?FlatList>();
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
    setShowSalmosBadge(navFilter == null || !navFilter.hasOwnProperty('stage'));
    setSearch(result);
    if (result.length > 0) {
      setTotalText(I18n.t('ui.list total songs', { total: result.length }));
    } else {
      setTotalText(I18n.t('ui.no songs found'));
    }
  }, [textFilter, props.filter, I18n.locale]);

  useLayoutEffect(() => {
    if (search && search.length > 0 && isFocused) {
      if (listRef.current) {
        listRef.current.scrollToIndex({
          index: 0,
          animated: true,
          viewOffset: 0,
          viewPosition: 1,
        });
      }
    }
  }, [search, isFocused]);

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
        <Spinner color={commonTheme.brandPrimary} style={{ flex: 3 }} />
        <Text note style={{ flex: 1, textAlign: 'center' }}>
          {loading.text}
        </Text>
      </View>
    );
  }

  return (
    <SearchBarView value={textFilter} setValue={setTextFilter}>
      <ListItem itemDivider>
        <Text note>{totalText}</Text>
      </ListItem>
      <FlatList
        ref={listRef}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        keyboardShouldPersistTaps="always"
        data={search || []}
        keyExtractor={(item) => item.path}
        renderItem={({ item }) => {
          return (
            <SongListItem
              key={item.nombre}
              showBadge={showSalmosBadge}
              songKey={item.key}
              onPress={onPress}
              viewButton={viewButton}
              highlight={textFilter}
              devModeDisabled={props.devModeDisabled}
            />
          );
        }}
      />
    </SearchBarView>
  );
};

export default SongList;
