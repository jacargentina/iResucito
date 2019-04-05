// @flow
import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { Text, ListItem, Body, Right, Icon } from 'native-base';
import { withNavigationFocus } from 'react-navigation';
import { FlatList, Keyboard } from 'react-native';
import SearchBarView from './SearchBarView';
import Highlighter from 'react-native-highlight-words';
import commonTheme from '../native-base-theme/variables/platform';
import textTheme from '../native-base-theme/components/Text';
import { DataContext } from '../DataContext';
import I18n from '../translations';

var textStyles = textTheme(commonTheme);
var noteStyles = textStyles['.note'];
delete textStyles['.note'];

const titleLocaleKey = 'search_title.unassigned';

const UnassignedList = (props: any) => {
  const data = useContext(DataContext);
  const listRef = useRef<?FlatList>();
  const { navigation, isFocused } = props;
  const { songs, localeSongs } = data.songsMeta;

  const [totalText, setTotalText] = useState(I18n.t('ui.loading'));
  const [textFilter, setTextFilter] = useState('');

  useEffect(() => {
    navigation.setParams({ title: I18n.t(titleLocaleKey) });
  }, [I18n.locale]);

  const search = useMemo(() => {
    var result = localeSongs.filter(locSong => {
      return !songs.find(s => s.files[I18n.locale] === locSong.nombre);
    });
    var result = result.filter(locSong => {
      return (
        locSong.titulo.toLowerCase().includes(textFilter.toLowerCase()) ||
        locSong.fuente.toLowerCase().includes(textFilter.toLowerCase())
      );
    });
    setTotalText(I18n.t('ui.list total songs', { total: result.length }));
    return result;
  }, [localeSongs, textFilter]);

  useEffect(() => {
    if (search.length > 0 && isFocused) {
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollToIndex({
            index: 0,
            animated: true,
            viewOffset: 0,
            viewPosition: 1
          });
        }
      }, 50);
    }
  }, [search.length]);

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
        keyExtractor={item => item.nombre}
        renderItem={({ item }) => {
          return (
            <ListItem>
              <Body>
                <Highlighter
                  style={textStyles}
                  highlightStyle={{
                    backgroundColor: 'yellow'
                  }}
                  searchWords={[textFilter]}
                  textToHighlight={item.titulo}
                />
                <Highlighter
                  style={noteStyles}
                  highlightStyle={{
                    backgroundColor: 'yellow'
                  }}
                  searchWords={[textFilter]}
                  textToHighlight={item.fuente}
                />
              </Body>
              <Right>
                <Icon
                  name="link"
                  style={{
                    fontSize: 32,
                    color: commonTheme.brandPrimary
                  }}
                  onPress={() =>
                    navigation.navigate('SalmoChooseLocale', { target: item })
                  }
                />
              </Right>
            </ListItem>
          );
        }}
      />
    </SearchBarView>
  );
};

UnassignedList.navigationOptions = () => {
  return { title: I18n.t(titleLocaleKey) };
};

export default withNavigationFocus(UnassignedList);
