// @flow
import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { Text, ListItem, Body, Right, Icon } from 'native-base';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { FlatList, Keyboard, TouchableOpacity, Alert } from 'react-native';
import SearchBarView from './SearchBarView';
import Highlighter from 'react-native-highlight-words';
import commonTheme from '../native-base-theme/variables/platform';
import textTheme from '../native-base-theme/components/Text';
import { DataContext } from '../DataContext';
import { NativeSongs } from '../util';
import I18n from '../../translations';

var textStyles = textTheme(commonTheme);
var noteStyles = textStyles['.note'];
delete textStyles['.note'];

const UnassignedList = (props: any) => {
  const data = useContext(DataContext);
  const isFocused = useIsFocused();
  const listRef = useRef<any>();
  const navigation = useNavigation();
  const { songs, localeSongs } = data.songsMeta;

  const [totalText, setTotalText] = useState(I18n.t('ui.loading'));
  const [textFilter, setTextFilter] = useState('');

  const search = useMemo(() => {
    var result = localeSongs.filter((locSong) => {
      const rawLoc = I18n.locale;
      if (!songs.find((s) => s.files[rawLoc] === locSong.nombre)) {
        const locale = rawLoc.split('-')[0];
        return !songs.find((s) => s.files[locale] === locSong.nombre);
      }
      return false;
    });
    var result = result.filter((locSong) => {
      return (
        locSong.titulo.toLowerCase().includes(textFilter.toLowerCase()) ||
        locSong.fuente.toLowerCase().includes(textFilter.toLowerCase())
      );
    });
    setTotalText(I18n.t('ui.list total songs', { total: result.length }));
    return result;
  }, [songs, localeSongs, textFilter]);

  useEffect(() => {
    if (search.length > 0 && isFocused) {
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollToIndex({
            index: 0,
            animated: true,
            viewOffset: 0,
            viewPosition: 1,
          });
        }
      }, 50);
    }
  }, [search.length, isFocused]);

  return (
    <SearchBarView value={textFilter} setValue={setTextFilter}>
      <ListItem itemDivider>
        <Text note>{totalText}</Text>
      </ListItem>
      <FlatList
        ref={listRef}
        onScrollBeginDrag={() => Keyboard.dismiss()}
        keyboardShouldPersistTaps="always"
        data={search}
        keyExtractor={(item) => item.nombre}
        renderItem={({ item }) => {
          return (
            <ListItem>
              <Body>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('SongChooseLocale', {
                      target: item,
                      targetType: 'file',
                    })
                  }>
                  <Highlighter
                    style={textStyles}
                    highlightStyle={{
                      backgroundColor: 'yellow',
                    }}
                    searchWords={[textFilter]}
                    textToHighlight={item.titulo}
                  />
                  <Highlighter
                    style={noteStyles}
                    highlightStyle={{
                      backgroundColor: 'yellow',
                    }}
                    searchWords={[textFilter]}
                    textToHighlight={item.fuente}
                  />
                </TouchableOpacity>
              </Body>
              <Right>
                <Icon
                  name="eye-outline"
                  style={{
                    fontSize: 32,
                    color: commonTheme.brandPrimary,
                  }}
                  onPress={() => {
                    NativeSongs.loadLocaleSongFile(I18n.locale, item).then(
                      (text) => {
                        Alert.alert(I18n.t('screen_title.preview'), text);
                      }
                    );
                  }}
                />
              </Right>
            </ListItem>
          );
        }}
      />
    </SearchBarView>
  );
};

export default UnassignedList;
