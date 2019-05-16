// @flow
import React, { Fragment, useEffect, useState, useContext } from 'react';
import { List, Input, Label } from 'semantic-ui-react';
import { DataContext } from './DataContext';
import { useDebounce } from 'use-debounce';
import I18n from '../../src/translations';
import colors from '../../src/colors';

const SongList = () => {
  const data = useContext(DataContext);
  const { loadSong, songs } = data;
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm] = useDebounce(searchTerm, 800);

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

  return (
    <Fragment>
      <div style={{ padding: 10 }}>
        <Input
          fluid
          icon="search"
          placeholder={I18n.t('ui.search placeholder')}
          onChange={(e, data) => setSearchTerm(data.value)}
          value={searchTerm}
        />
      </div>
      <List
        divided
        relaxed
        size="big"
        style={{ margin: 0, padding: 10, overflowY: 'scroll' }}>
        {filtered.map((song, key) => {
          return (
            <List.Item key={key} onClick={() => loadSong(song)}>
              <List.Content>
                <List.Header>{song.nombre}</List.Header>
                <List.Description>{song.fuente}</List.Description>
                <div style={{ marginTop: 8 }}>
                  <Label
                    style={{ backgroundColor: colors[song.stage] }}
                    size="small">
                    {song.stage[0].toUpperCase()}
                  </Label>
                  {song.patched && (
                    <Label color="red" size="small">
                      patched
                    </Label>
                  )}
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
