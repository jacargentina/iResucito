// @flow
import React, { useState, useEffect } from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { View, StyleSheet } from 'react-native';
import { Input, Item, Icon } from 'native-base';
import { NavigationActions } from 'react-navigation';
import commonTheme from '../native-base-theme/variables/platform';
import I18n from '../translations';
import { useDebounce } from 'use-debounce';

const DebouncedInput = (props: any) => {
  const { value } = props;
  const [searchTerm, setSearchTerm] = useState(value);
  const [debouncedTerm] = useDebounce(searchTerm, 800);

  useEffect(() => {
    props.setValue(debouncedTerm);
  }, [debouncedTerm]);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  return (
    <Input
      style={{
        lineHeight: 20,
        height: commonTheme.searchBarHeight
      }}
      placeholder={I18n.t('ui.search placeholder')}
      onChangeText={setSearchTerm}
      value={searchTerm}
      returnKeyType="search"
      autoCapitalize="none"
      clearButtonMode="always"
      autoCorrect={false}
    />
  );
};

const SearchBarView = (props: any) => {
  return (
    <AndroidBackHandler
      onBackPress={() => {
        NavigationActions.back();
        return true;
      }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            backgroundColor: commonTheme.toolbarInputColor,
            borderRadius: 16,
            margin: 10
          }}>
          <Item
            style={{
              height: commonTheme.searchBarHeight,
              borderColor: 'transparent',
              paddingHorizontal: 15
            }}>
            <Icon name="search" />
            <DebouncedInput value={props.value} setValue={props.setValue} />
          </Item>
        </View>
        <View
          style={{
            flex: 1,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: commonTheme.listBorderColor
          }}>
          {props.children}
        </View>
      </View>
    </AndroidBackHandler>
  );
};

export default SearchBarView;
