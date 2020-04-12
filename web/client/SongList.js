// @flow
import React, { Fragment, useEffect, useState, useContext } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import List from 'semantic-ui-react/dist/commonjs/elements/List';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import SongListResume from './SongListResume';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import { useDebounce } from 'use-debounce';
import I18n from '../../translations';
import colors from '../../colors';
import useHotkeys from 'use-hotkeys';

const SongList = () => {
  const data = useContext(DataContext);
  const { locale, listSongs, songs, apiLoading, previewPdf, pdf } = data;

  const edit = useContext(EditContext);
  const { loadSong, addSong, editSong } = edit;

  const [filters, setFilters] = useState({
    patched: false,
    added: false,
    notTranslated: false,
  });
  const [filtered, setFiltered] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm] = useDebounce(searchTerm, 800);

  const toggleFilter = (name) => {
    setFilters((currentFilters) => {
      return { ...currentFilters, [name]: !currentFilters[name] };
    });
  };

  const loadOrAdd = (song) => {
    if (song.notTranslated) {
      addSong(song);
    } else {
      loadSong(song.key);
    }
  };

  useEffect(() => {
    // filtrar
    if (songs) {
      const filterByText = songs.filter(
        (song) =>
          song.titulo.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
          song.fuente.toLowerCase().includes(debouncedTerm.toLowerCase())
      );
      const result = filterByText.filter((song) => {
        const flags = Object.keys(filters).map((name) => {
          return filters[name] === false || song[name] === filters[name];
        });
        return flags.every((f) => f === true);
      });
      setFiltered(result);
    }
  }, [debouncedTerm, songs, filters]);

  useEffect(() => {
    listSongs();
  }, [locale]);

  useHotkeys(
    (key) => {
      switch (key) {
        case 'ctrl+n':
          if (!editSong) {
            addSong();
          }
        case 'r':
          if (!editSong) {
            listSongs();
          }
          break;
      }
    },
    ['ctrl+n', 'r'],
    [editSong]
  );

  if (editSong || pdf.loading === true || pdf.url !== null) {
    return null;
  }

  return (
    <Fragment>
      <Menu size="mini" inverted attached color="blue">
        <Menu.Item>
          <Button.Group size="mini">
            <Popup
              content={<strong>Shortcut: Ctrl + N</strong>}
              size="mini"
              position="bottom left"
              trigger={
                <Button onClick={addSong}>
                  <Icon name="add" />
                  {I18n.t('ui.create')}
                </Button>
              }
            />
            <Popup
              content={<strong>Shortcut: r</strong>}
              size="mini"
              position="bottom left"
              trigger={
                <Button onClick={listSongs}>
                  <Icon name="refresh" />
                  {I18n.t('ui.refresh')}
                </Button>
              }
            />
            <Button onClick={previewPdf}>
              <Icon name="file pdf" />
              {I18n.t('share_action.view pdf')}
            </Button>
          </Button.Group>
        </Menu.Item>
        <Menu.Item>
          <Button.Group size="mini">
            <Button
              toggle
              active={filters.patched}
              onClick={() => toggleFilter('patched')}>
              {I18n.t('ui.filters.patched')}
            </Button>
            <Button
              toggle
              active={filters.added}
              onClick={() => toggleFilter('added')}>
              {I18n.t('ui.filters.added')}
            </Button>
            <Button
              toggle
              active={filters.notTranslated}
              onClick={() => toggleFilter('notTranslated')}>
              {I18n.t('ui.filters.untranslated')}
            </Button>
          </Button.Group>
        </Menu.Item>
        {filtered && (
          <Menu.Item>
            <strong style={{ marginLeft: 10 }}>
              {I18n.t('ui.list total songs', { total: filtered.length })}
            </strong>
          </Menu.Item>
        )}
        <SongListResume />
      </Menu>
      <div style={{ padding: 10 }}>
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
          display: editSong ? 'none' : null,
        }}>
        {filtered &&
          filtered.map((song, idx) => {
            return (
              <List.Item
                key={idx}
                onClick={() => loadOrAdd(song)}
                className="hoverable">
                <List.Content>
                  <List.Header>{song.titulo}</List.Header>
                  <List.Description>{song.fuente}</List.Description>
                  <div style={{ marginTop: 8 }}>
                    {song.stage && (
                      <Popup
                        content={I18n.t(`search_title.${song.stage}`)}
                        trigger={
                          <Label
                            style={{ backgroundColor: colors[song.stage] }}
                            size="small">
                            {song.stage[0].toUpperCase()}
                          </Label>
                        }
                      />
                    )}
                    {song.patched && (
                      <Label color="violet" size="small">
                        patched
                      </Label>
                    )}
                    {song.added && (
                      <Label color="violet" size="small">
                        added
                      </Label>
                    )}
                    {song.version > 0 && (
                      <Popup
                        content={I18n.t('ui.song version number', {
                          version: song.version,
                        })}
                        trigger={
                          <Label color="blue" size="small">
                            {song.version}
                          </Label>
                        }
                      />
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
