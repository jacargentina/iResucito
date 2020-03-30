// @flow
import React, { useContext, useState, useMemo } from 'react';
import ModalView from './ModalView';
import SearchBarView from './SearchBarView';
import { Text, ListItem, Body, Left, Icon } from 'native-base';
import { FlatList, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DataContext } from '../DataContext';
import I18n from '../../translations';
import commonTheme from '../native-base-theme/variables/platform';

const SongChooseLocaleDialog = (props: any) => {
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { songs, localeSongs, setSongPatch } = data.songsMeta;
  const [textFilter, setTextFilter] = useState('');
  const { target, targetType } = route.params;

  const items = useMemo(() => {
    var result = [];
    if (targetType === 'file') {
      // cuales songs no tienen el idioma actual establecido ?
      result = songs.filter((s) => !s.files[I18n.locale]);
      if (textFilter) {
        result = result.filter((s) => {
          return (
            s.nombre.toLowerCase().includes(textFilter.toLowerCase()) ||
            s.titulo.toLowerCase().includes(textFilter.toLowerCase()) ||
            s.fuente.toLowerCase().includes(textFilter.toLowerCase())
          );
        });
      }
    } else if (targetType === 'song') {
      // cuales archivos no estan en ningun song del locale actual?
      result = localeSongs.filter((locSong) => {
        return !songs.find((s) => s.files[I18n.locale] === locSong.nombre);
      });
      result = result.filter((locSong) => {
        return (
          locSong.titulo.toLowerCase().includes(textFilter.toLowerCase()) ||
          locSong.fuente.toLowerCase().includes(textFilter.toLowerCase())
        );
      });
    }
    return result;
  }, [I18n.locale, songs, localeSongs, textFilter]);

  const localeFileSelected = (item) => {
    var song: Song = targetType === 'file' ? item : target;
    var songFile: SongFile = targetType === 'file' ? target : item;

    // Definir funcion para llamar
    // en ambos casos del dialogo
    const applyChanges = (renameTo) => {
      setSongPatch(song, I18n.locale, {
        file: songFile.nombre,
        rename: renameTo,
      });
      navigation.goBack(null);
    };

    // Permitir elegir al usuario
    Alert.alert(
      `${I18n.t('ui.rename')}`,
      I18n.t('ui.locale patch rename message'),
      [
        {
          text: I18n.t('ui.yes'),
          onPress: () => {
            navigation.navigate('SongChangeName', {
              song: song,
              nameToEdit: songFile.nombre,
              action: applyChanges,
            });
          },
        },
        {
          text: I18n.t('ui.no'),
          onPress: () => {
            applyChanges();
          },
        },
      ]
    );
  };

  return (
    <ModalView title={I18n.t('screen_title.choose song')}>
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
              <Text numberOfLines={1}>{target.titulo}</Text>
              <Text numberOfLines={1} note>
                {target.fuente}
              </Text>
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
                  <Text numberOfLines={1}>{item.titulo}</Text>
                  <Text numberOfLines={1} note>
                    {item.fuente}
                  </Text>
                </Body>
              </ListItem>
            );
          }}
        />
      </SearchBarView>
    </ModalView>
  );
};

export default SongChooseLocaleDialog;
