// @flow
import React, { Fragment, useEffect, useState, useContext } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import List from 'semantic-ui-react/dist/commonjs/elements/List';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import { useDebounce } from 'use-debounce';
import { getPropertyLocale } from '../../common';
import I18n from '../../translations';
import colors from '../../colors';

const SongList = () => {
  const data = useContext(DataContext);
  const { locale, listSongs, songs, apiLoading } = data;
  const [filters, setFilters] = useState({
    patched: false,
    notTranslated: false
  });
  const [filtered, setFiltered] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm] = useDebounce(searchTerm, 800);

  const notUsingSpanish = I18n.locale.split('-')[0] !== 'es';

  const toggleFilter = name => {
    setFilters(currentFilters => {
      return { ...currentFilters, [name]: !currentFilters[name] };
    });
  };

  useEffect(() => {
    // filtrar
    if (songs) {
      const filterByText = songs.filter(
        song =>
          song.titulo.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          song.fuente.toLowerCase().includes(debouncedTerm.toLowerCase())
      );

      const addNotTranslated = filterByText.map(song => {
        song.notTranslated =
          notUsingSpanish &&
          !song.patched &&
          !getPropertyLocale(song.files, I18n.locale);
        return song;
      });

      const result = addNotTranslated.filter(song => {
        const flags = Object.keys(filters).map(name => {
          return filters[name] === false || song[name] === filters[name];
        });
        return flags.every(f => f === true);
      });

      setFiltered(result);
    }
  }, [debouncedTerm, songs, filters]);

  useEffect(() => {
    listSongs();
  }, [locale]);

  const edit = useContext(EditContext);
  const { loadSong, editSong } = edit;

  if (editSong) {
    return null;
  }

  return (
    <Fragment>
      <div style={{ padding: 10 }}>
        <div style={{ margin: 5 }}>
          <Button
            toggle
            active={filters.patched}
            onClick={() => toggleFilter('patched')}>
            {I18n.t('ui.filters.patched')}
          </Button>
          <Button
            toggle
            active={filters.notTranslated}
            onClick={() => toggleFilter('notTranslated')}>
            {I18n.t('ui.filters.untranslated')}
          </Button>
          {filtered && (
            <strong style={{ marginLeft: 10 }}>
              {I18n.t('ui.list total songs', { total: filtered.length })}
            </strong>
          )}
        </div>
        <Input
          fluid
          icon="search"
          placeholder={I18n.t('ui.search placeholder')}
          onChange={(e, data) => setSearchTerm(data.value)}
          value={searchTerm}
          loading={apiLoading}
        />
        {filtered && filtered.length === 0 && (
          <Message>{I18n.t('ui.no songs found')}</Message>
        )}
      </div>
      <List
        size="big"
        divided
        style={{
          margin: 0,
          paddingLeft: 10,
          paddingRight: 10,
          overflowY: 'scroll',
          display: editSong ? 'none' : null
        }}>
        {filtered &&
          filtered.map((song, key) => {
            return (
              <List.Item
                key={key}
                onClick={() => loadSong(song)}
                className="hoverable">
                <List.Content>
                  <List.Header>{song.titulo}</List.Header>
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
                    {song.notTranslated && (
                      <Label color="red" size="small">
                        {I18n.t('ui.locale warning title')}
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
