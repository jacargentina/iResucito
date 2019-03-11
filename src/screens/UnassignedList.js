// @flow
import React, { useContext, useEffect, useRef } from 'react';
import { Text, ListItem, Body, Right, Icon } from 'native-base';
import { FlatList, Keyboard } from 'react-native';
import SearchBarView from './SearchBarView';
import Highlighter from 'react-native-highlight-words';
import commonTheme from '../native-base-theme/variables/platform';
import textTheme from '../native-base-theme/components/Text';
import { DataContext, useSearchUnassignedSongs } from '../DataContext';
import I18n from '../translations';

var textStyles = textTheme(commonTheme);
var noteStyles = textStyles['.note'];
delete textStyles['.note'];

const UnassignedList = () => {
  const data = useContext(DataContext);
  const listRef = useRef();
  const { songs, localeSongs } = data.songsMeta;
  const { getLocaleReal } = data.settings;
  const { show } = data.salmoChooserDialog;
  const { search, textFilter, setTextFilter } = useSearchUnassignedSongs(
    songs,
    localeSongs,
    getLocaleReal
  );

  useEffect(() => {
    if (search.length > 0) {
      setTimeout(() => {
        listRef.scrollToIndex({ index: 0, animated: true });
      }, 10);
    }
  }, [search]);

  return (
    <SearchBarView value={textFilter} setValue={setTextFilter}>
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
                  onPress={() => show(item)}
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
  return {
    title: I18n.t('search_title.unassigned')
  };
};
export default UnassignedList;
