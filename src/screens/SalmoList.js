// @flow
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Badge, Text } from 'native-base';
import { FlatList, Keyboard } from 'react-native';
import SearchBarView from './SearchBarView';
import SalmoListItem from './SalmoListItem';
import AppNavigatorOptions from '../AppNavigatorOptions';
import I18n from '../translations';
import { DataContext, useSearchSongs } from '../DataContext';

const SalmoList = (props: any) => {
  const listRef = useRef();
  const data = useContext(DataContext);
  const { songs } = data.songsMeta;
  const { keys } = data.settings;
  const { search, textFilter, setTextFilter, showSalmosBadge } = useSearchSongs(
    songs,
    props
  );

  const onPress = salmo => {
    if (props.onPress) {
      props.onPress(salmo);
    } else {
      props.navigation.navigate('SalmoDetail', { salmo: salmo });
    }
  };

  return (
    <SearchBarView
      value={textFilter}
      setValue={setTextFilter}
      afterSearchHandler={() => {
        if (search.length > 0) {
          setTimeout(() => {
            listRef.scrollToIndex({ index: 0, animated: true });
          }, 10);
        }
      }}>
      {search.length == 0 && (
        <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
          {I18n.t('ui.no songs found')}
        </Text>
      )}
      <FlatList
        ref={listRef}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        keyboardShouldPersistTaps="always"
        data={search}
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

const CountText = props => {
  const data = useContext(DataContext);
  const { songs } = data.songsMeta;
  const { search } = useSearchSongs(songs, props);
  return (
    <Badge style={{ marginTop: 8, marginRight: 6 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          fontStyle: 'italic',
          textAlign: 'center',
          color: AppNavigatorOptions.headerTitleStyle.color
        }}>
        {search.length}
      </Text>
    </Badge>
  );
};

SalmoList.navigationOptions = (props: any) => {
  return {
    title: props.navigation.getParam('title', 'Sin título'),
    headerRight: <CountText {...props} />
  };
};

export default SalmoList;
