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
import { Keyboard, View } from 'react-native';
import { FlatList, Text, Spinner, useDisclose } from 'native-base';
import SearchBarView from '../components/SearchBarView';
import ExportToPdfButton from '../components/ExportToPdfButton';
import ChoosePdfTypeForExport from '../components/ChoosePdfTypeForExport';
import I18n from '../../translations';
import { DataContext } from '../DataContext';
import SongListItem from './SongListItem';

const SongList = (props: any): React.Node => {
  const listRef = useRef<any>();
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const chooser = useDisclose();
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
      if (isFocused && textFilter && listRef.current) {
        listRef.current.scrollToIndex({
          index: 0,
          animated: true,
          viewOffset: 0,
          viewPosition: 1,
        });
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
      <ChoosePdfTypeForExport chooser={chooser} />
      <Text bold p="2" px="4" bg="gray.100" color="muted.500">
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
