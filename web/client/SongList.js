// @flow
import React, { Fragment, useEffect, useState, useContext } from 'react';
import * as axios from 'axios';
import { List, Input } from 'semantic-ui-react';
import { DataContext } from './DataContext';
import { useDebounce } from 'use-debounce';
import I18n from '../../src/translations';

declare var API_PORT: number;

axios.defaults.baseURL = location.protocol + '//' + location.hostname;

if (API_PORT) {
  axios.defaults.baseURL += ':' + API_PORT;
}

const SongList = () => {
  const data = useContext(DataContext);
  const { locale, setEditSong } = data;
  const [songs, setSongs] = useState();
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm] = useDebounce(searchTerm, 800);

  const loadSong = song => {
    axios.get(`/api/song/${song.key}/${locale}`).then(result => {
      setEditSong(result.data);
    });
  };

  useEffect(() => {
    // filtrar
    if (songs) {
      const result = songs.filter(
        s =>
          s.titulo.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          s.fuente.toLowerCase().includes(debouncedTerm.toLowerCase())
      );
      setFiltered(result);
      console.log('filter', debouncedTerm, result.length);
    }
  }, [debouncedTerm, songs]);

  useEffect(() => {
    axios.get(`/api/list/${locale}`).then(result => {
      setSongs(result.data);
    });
  }, [locale]);

  return (
    <Fragment>
      <Input
        icon="search"
        style={{ margin: '0 10px' }}
        placeholder={I18n.t('ui.search placeholder')}
        onChange={(e, data) => setSearchTerm(data.value)}
        value={searchTerm}
      />
      <List
        divided
        relaxed
        size="big"
        style={{ marginLeft: '10px', overflowY: 'scroll' }}>
        {filtered.map((song, key) => {
          return (
            <List.Item key={key} onClick={() => loadSong(song)}>
              <List.Content>
                <List.Header>{song.nombre}</List.Header>
                <List.Description>{song.fuente}</List.Description>
              </List.Content>
            </List.Item>
          );
        })}
      </List>
    </Fragment>
  );
};

export default SongList;
