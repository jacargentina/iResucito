// @flow
import React, { Fragment, useEffect, useState, useContext } from 'react';
import { List, Input, Label } from 'semantic-ui-react';
import { DataContext } from './DataContext';
import { useDebounce } from 'use-debounce';
import I18n from '../../src/translations';
import colors from '../../src/colors';

const SongList = () => {
  const data = useContext(DataContext);
  const { locale, loadSong, listSongs, songs, apiLoading } = data;
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm] = useDebounce(searchTerm, 800);

  const notUsingSpanish = I18n.locale.split('-')[0] !== 'es';

  useEffect(() => {
    // filtrar
    if (songs) {
      const result = songs.filter(
        s =>
          s.titulo.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          s.fuente.toLowerCase().includes(debouncedTerm.toLowerCase())
      );
      setFiltered(result);
    }
  }, [debouncedTerm, songs]);

  useEffect(() => {
    listSongs();
  }, [locale]);

  return (
    <Fragment>
      <div style={{ padding: 10 }}>
        <Input
          fluid
          icon="search"
          placeholder={I18n.t('ui.search placeholder')}
          onChange={(e, data) => setSearchTerm(data.value)}
          value={searchTerm}
          loading={apiLoading}
        />
      </div>
      <List
        divided
        relaxed
        size="big"
        style={{ margin: 0, padding: 10, overflowY: 'scroll' }}>
        {filtered.map((song, key) => {
          if (
            notUsingSpanish &&
            !song.patched &&
            !song.files.hasOwnProperty(I18n.locale)
          ) {
            var noLocale = (
              <Label color="red" size="small">
                {I18n.t('ui.locale warning title')}
              </Label>
            );
          }
          return (
            <List.Item key={key} onClick={() => loadSong(song)}>
              <List.Content>
                <List.Header>{song.nombre}</List.Header>
                <List.Description>{song.fuente}</List.Description>
                <div style={{ marginTop: 8 }}>
                  {song.stage && (
                    <Label
                      style={{ backgroundColor: colors[song.stage] }}
                      size="small">
                      {song.stage[0].toUpperCase()}
                    </Label>
                  )}
                  {song.patched && (
                    <Label color="violet" size="small">
                      patched
                    </Label>
                  )}
                  {noLocale}
                </div>
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    </Fragment>
  );
};

export default SongList;
