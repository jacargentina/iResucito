// @flow
import React, { useContext, useEffect, useRef, useState } from 'react';
import { withNavigation } from 'react-navigation';
import { FlatList, Keyboard } from 'react-native';
import { Text, ListItem } from 'native-base';
import SearchBarView from './SearchBarView';
import SalmoListItem from './SalmoListItem';
import I18n from '../translations';
import { DataContext, useSearchSongs } from '../DataContext';

const SalmoList = (props: any) => {
  const listRef = useRef();
  const data = useContext(DataContext);
  const [totalText, setTotalText] = useState(I18n.t('ui.loading'));
  const { songs } = data.songsMeta;
  const { search, textFilter, setTextFilter, showSalmosBadge } = useSearchSongs(
    songs,
    props.navigation.getParam('filter', undefined),
    props.filter
  );

  useEffect(() => {
    if (search) {
      if (search.length > 0) {
        if (listRef.current) {
          setTimeout(() => {
            listRef.current.scrollToIndex({
              index: 0,
              animated: true,
              viewOffset: 0,
              viewPosition: 1
            });
          }, 50);
        }
        setTotalText(I18n.t('ui.list total songs', { total: search.length }));
      } else {
        setTotalText(I18n.t('ui.no songs found'));
      }
    }
  }, [search]);

  const onPress = salmo => {
    if (props.onPress) {
      props.onPress(salmo);
    } else {
      props.navigation.navigate('SalmoDetail', { salmo: salmo });
    }
  };

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
        keyExtractor={item => item.path}
        renderItem={({ item }) => {
          return (
            <SalmoListItem
              key={item.nombre}
              showBadge={showSalmosBadge}
              salmo={item}
              onPress={onPress}
              highlight={textFilter}
              devModeDisabled={props.devModeDisabled}
            />
          );
        }}
      />
    </SearchBarView>
  );
};

SalmoList.navigationOptions = (props: any) => {
  return {
    title: props.navigation.getParam('title', 'Sin título')
  };
};

export default withNavigation(SalmoList);
