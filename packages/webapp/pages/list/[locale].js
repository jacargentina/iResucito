// @flow
import React, { useEffect, useState } from 'react';
import {
  Button,
  List,
  Input,
  Label,
  Message,
  Menu,
  Popup,
  Icon,
  Loader,
} from 'semantic-ui-react';
import * as axios from 'axios';
import { useRouter } from 'next/router';
import useHotkeys from 'use-hotkeys';
import Layout from 'components/Layout';
import SongBook from 'components/SongBook';
import DataContextWrapper from 'components/DataContext';
import SongListResume from 'components/SongListResume';
import { useDebounce } from 'use-debounce';
import { getPropertyLocale, getLocalesForPicker } from '../../../../common';
import I18n from '../../../../translations';
import colors from '../../../../colors';
import { readLocalePatch } from '../../common';
import FolderSongs from '../../../../FolderSongs';

const SongList = (props: any) => {
  const { songs } = props;
  const router = useRouter();
  const [pdf, setPdf] = useState({ loading: false, url: null });

  const previewPdf = () => {
    const savedSettings = localStorage.getItem('pdfExportOptions');
    const data = {
      options: null,
    };
    if (savedSettings) {
      data.options = JSON.parse(savedSettings);
    }
    setPdf({ loading: true, url: null });
    return axios
      .post(`/api/pdf/${I18n.locale}`, data, {
        responseType: 'blob',
      })
      .then((response) => {
        setPdf({
          loading: false,
          url: window.URL.createObjectURL(new Blob([response.data])),
        });
      })
      .catch(async (err) => {
        const text = await new Response(err.response.data).text();
        window.alert(JSON.stringify(text));
        setPdf({ loading: false, url: null });
      });
  };

  const closePdf = () => {
    setPdf({ loading: false, url: null });
  };

  const [filters, setFilters] = useState({
    patched: false,
    added: false,
    notTranslated: false,
  });
  const [onlyTranslated, setOnlyTranslated] = useState();
  const [filtered, setFiltered] = useState();
  const [filtering, setFiltering] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm] = useDebounce(searchTerm, 800);

  const toggleFilter = (name: string) => {
    setFilters((currentFilters) => {
      return { ...currentFilters, [name]: !currentFilters[name] };
    });
  };

  const edit = (song) => {
    router.push(`/edit/${I18n.locale}/${song.key}`);
  };

  const addSong = () => {
    axios
      .get(`/api/song/newSong/${I18n.locale}`)
      .then((result) => {
        edit(result.data.song);
      })
      .catch((err) => {
        window.alert(err.message);
      });
  };

  useEffect(() => {
    // filtrar
    if (songs && !filtering) {
      setFiltering(true);
      const filterByText = debouncedTerm
        ? songs.filter(
            (song) =>
              song.titulo.toLowerCase().includes(debouncedTerm.toLowerCase()) ||
              song.fuente.toLowerCase().includes(debouncedTerm.toLowerCase())
          )
        : songs;
      const result = filterByText.filter((song) => {
        const flags = Object.keys(filters).map((name) => {
          return filters[name] === false || song[name] === filters[name];
        });
        if (onlyTranslated) {
          flags.push(getPropertyLocale(song.files, I18n.locale) !== undefined);
        }
        return flags.every((f) => f === true);
      });
      setFiltered(result);
      setFiltering(false);
    }
  }, [debouncedTerm, songs, filtering, filters, onlyTranslated]);

  useHotkeys(
    (key) => {
      switch (key) {
        case 'ctrl+n':
          addSong();
          break;
        default:
          break;
      }
    },
    ['ctrl+n', 'r'],
    []
  );

  return (
    <DataContextWrapper>
      <Layout title="Buscador">
        <Menu size="mini" inverted attached color="blue">
          {pdf.url && (
            <Menu.Item position="right">
              <Button onClick={closePdf}>
                <Icon name="close" />
                {I18n.t('ui.close')}
              </Button>
            </Menu.Item>
          )}
          {!pdf.url && (
            <>
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
                  <Button
                    toggle
                    active={onlyTranslated}
                    onClick={() => setOnlyTranslated((state) => !state)}>
                    {I18n.t('ui.filters.translated')}
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
            </>
          )}
        </Menu>
        {!pdf.url && !pdf.loading && (
          <>
            <div style={{ padding: 10 }}>
              <Input
                fluid
                icon="search"
                placeholder={I18n.t('ui.search placeholder')}
                onChange={(e, data) => setSearchTerm(data.value)}
                defaultValue=""
                loading={filtering}
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
              }}>
              {filtered &&
                filtered.map((song, idx) => {
                  return (
                    <List.Item
                      key={idx}
                      onClick={() => edit(song)}
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
                                  style={{
                                    backgroundColor: colors[song.stage],
                                  }}
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
          </>
        )}
        {pdf.loading && (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Loader active inline="centered" size="large" inverted={false} />
          </div>
        )}
        }{pdf.url && <SongBook />}
      </Layout>
    </DataContextWrapper>
  );
};

export async function getStaticProps({ params }: any) {
  const patch = await readLocalePatch();
  const { locale } = params;
  if (!locale) {
    throw new Error('Locale not provided');
  }
  const songs = FolderSongs.getSongsMeta(locale, patch);
  return {
    props: {
      songs,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const locales = getLocalesForPicker('en');
  return {
    // $FlowFixMe
    paths: locales.map((item) => ({ params: { locale: item.value } })),
    fallback: false,
  };
}

export default SongList;
