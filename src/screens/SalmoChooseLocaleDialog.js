// @flow
import React, { useContext, useState, useMemo } from 'react';
import BaseModal from './BaseModal';
import SearchBarView from './SearchBarView';
import { Text, ListItem, Body, Left, Icon } from 'native-base';
import { FlatList } from 'react-native';
import { DataContext } from '../DataContext';
import I18n from '../translations';
import commonTheme from '../native-base-theme/variables/platform';

const SalmoChooseLocaleDialog = (props: any) => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const { songs, setSongLocalePatch } = data.songsMeta;
  const [textFilter, setTextFilter] = useState('');

  const target = navigation.getParam('target');

  const items = useMemo(() => {
    var result = songs.filter(s => !s.files[I18n.locale]);
    if (textFilter) {
      result = result.filter(s => {
        return (
          s.nombre.toLowerCase().includes(textFilter.toLowerCase()) ||
          s.titulo.toLowerCase().includes(textFilter.toLowerCase()) ||
          s.fuente.toLowerCase().includes(textFilter.toLowerCase())
        );
      });
    }
    return result;
  }, [I18n.locale, songs, textFilter]);

  const localeFileSelected = song => {
    setSongLocalePatch(song, I18n.locale, target);
    navigation.goBack(null);
  };

  return (
    <BaseModal title={I18n.t('screen_title.choose song')} fade={true}>
      <SearchBarView value={textFilter} setValue={setTextFilter}>
        {target && (
          <ListItem icon button last>
            <Left>
              <Icon
                name="musical-notes"
                style={{ color: commonTheme.brandInfo }}
              />
            </Left>
            <Body>
              <Text>{target.titulo}</Text>
              <Text note>{target.fuente}</Text>
            </Body>
          </ListItem>
        )}
        {target && (
          <ListItem itemDivider>
            <Text note>
              {I18n.t('ui.list total songs', { total: items.length })}
            </Text>
          </ListItem>
        )}
        <FlatList
          data={items}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <ListItem
                onPress={() => {
                  localeFileSelected(item);
                }}>
                <Body>
                  <Text>{item.titulo}</Text>
                  <Text note>{item.fuente}</Text>
                </Body>
              </ListItem>
            );
          }}
        />
      </SearchBarView>
    </BaseModal>
  );
};

export default SalmoChooseLocaleDialog;
