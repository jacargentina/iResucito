// @flow
import React, { useContext, useEffect, useRef, useState } from 'react';
import { withNavigation, withNavigationFocus } from 'react-navigation';
import { FlatList, Keyboard } from 'react-native';
import { Text, ListItem } from 'native-base';
import SearchBarView from './SearchBarView';
import SalmoListItem from './SalmoListItem';
import I18n from '../translations';
import { DataContext } from '../DataContext';

const SalmoList = (props: any) => {
  const listRef = useRef();
  const data = useContext(DataContext);
  const { navigation, filter, isFocused } = props;
  const [totalText, setTotalText] = useState(I18n.t('ui.loading'));
  const { songs } = data.songsMeta;

  const navFilter = Object.assign({}, navigation.getParam('filter'), filter);
  const [showSalmosBadge, setShowSalmosBadge] = useState();
  const [textFilter, setTextFilter] = useState('');
  const [search, setSearch] = useState();

  useEffect(() => {
    var result = songs;
    if (navFilter) {
      for (var name in navFilter) {
        result = result.filter(s => s[name] == navFilter[name]);
      }
    }
    if (textFilter) {
      result = result.filter(s => {
        return (
          s.nombre.toLowerCase().includes(textFilter.toLowerCase()) ||
          s.fullText.toLowerCase().includes(textFilter.toLowerCase())
        );
      });
    }
    setShowSalmosBadge(navFilter == null || !navFilter.hasOwnProperty('etapa'));
    setSearch(result);
  }, [navFilter, textFilter]);

  useEffect(() => {
    navigation.setParams({ title: I18n.t(navigation.getParam('title_key')) });
  }, [I18n.locale]);

  useEffect(() => {
    if (search) {
      if (search.length > 0 && isFocused) {
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
  }, [search, isFocused]);

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
    title: I18n.t(props.navigation.getParam('title_key'))
  };
};

export default withNavigationFocus(withNavigation(SalmoList));
