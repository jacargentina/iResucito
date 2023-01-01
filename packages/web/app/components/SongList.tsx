import { useMemo, useEffect, useState } from 'react';
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
import useHotkeys from 'use-hotkeys';
import SongViewPdf from '~/components/SongViewPdf';
import ApiMessage from '~/components/ApiMessage';
import SongListResume from '~/components/SongListResume';
import { useDebounce } from 'use-debounce';
import { colors, getPropertyLocale, Song } from '@iresucito/core';
import i18n from '@iresucito/translations';
import { useApp } from '~/app.context';
import { useNavigate } from '@remix-run/react';

const SongList = (props: { songs: Array<Song> }) => {
  const { songs } = props;
  const app = useApp();
  const { setApiResult, handleApiError } = app;
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const patchedCount = useMemo(() => {
    return songs.filter((s) => s.patched === true).length;
  }, [songs]);
  const addedCount = useMemo(() => {
    return songs.filter((s) => s.added === true).length;
  }, [songs]);
  const notTranslatedCount = useMemo(() => {
    return songs.filter((s) => s.notTranslated === true).length;
  }, [songs]);

  const closePdf = () => {
    setLoading(false);
    setPdfUrl(undefined);
  };

  const previewPdf = () => {
    const formData = new FormData();
    const savedSettings = localStorage.getItem('pdfExportOptions');
    if (savedSettings) {
      formData.append('options', savedSettings);
    }
    setLoading(true);
    setPdfUrl(undefined);
    return fetch(`/pdf/full`, { method: 'POST', body: formData })
      .then((response) => {
        return response.blob();
      })
      .then((data) => {
        setLoading(false);
        setPdfUrl(window.URL.createObjectURL(new Blob([data])));
      })
      .catch(async (err) => {
        const text = await new Response(err.response.data).text();
        handleApiError(text);
        closePdf();
      });
  };

  const [filters, setFilters] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const savedFilters = localStorage.getItem('filters');
      if (savedFilters) {
        return JSON.parse(savedFilters);
      }
    }
    return {
      patched: false,
      added: false,
      notTranslated: false,
    };
  });

  const [onlyTranslated, setOnlyTranslated] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<Array<Song>>();
  const [filtering, setFiltering] = useState(false);
  const searchTermDefaultValue = useMemo(() => {
    if (typeof localStorage !== 'undefined') {
      const savedSearchTerm = localStorage.getItem('searchTerm');
      if (savedSearchTerm) {
        return JSON.parse(savedSearchTerm);
      }
    }
    return '';
  }, []);
  const [searchTerm, setSearchTerm] = useState(searchTermDefaultValue);
  const [debouncedTerm] = useDebounce(searchTerm, 800);

  const toggleFilter = (name: string) => {
    setFilters((currentFilters) => {
      const newFilters = { ...currentFilters, [name]: !currentFilters[name] };
      localStorage.setItem('filters', JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const edit = (song) => {
    setLoading(true);
    navigate(`/edit/${song.key}`);
  };

  const addSong = () => {
    setApiResult();
    fetch(`/song/newSong`)
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        edit(data.song);
      })
      .catch((err) => {
        handleApiError(err);
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
          flags.push(getPropertyLocale(song.files, i18n.locale) !== '');
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
    <>
      <Menu size="mini" inverted attached color="blue">
        {pdfUrl && (
          <Menu.Item position="right">
            <Button onClick={closePdf}>
              <Icon name="close" />
              {i18n.t('ui.close')}
            </Button>
          </Menu.Item>
        )}
        {!pdfUrl && (
          <>
            <Menu.Item>
              <Button.Group size="mini">
                {app.user && (
                  <Popup
                    content={<strong>Shortcut: Ctrl + N</strong>}
                    size="mini"
                    position="bottom left"
                    trigger={
                      <Button onClick={addSong}>
                        <Icon name="add" />
                        {i18n.t('ui.create')}
                      </Button>
                    }
                  />
                )}
                <Button onClick={previewPdf}>
                  <Icon name="file pdf" />
                  {i18n.t('share_action.view pdf')}
                </Button>
              </Button.Group>
            </Menu.Item>
            <Menu.Item>
              <Button.Group size="mini">
                <Button
                  toggle
                  active={filters.patched}
                  onClick={() => toggleFilter('patched')}>
                  {i18n.t('ui.filters.patched')}
                  {patchedCount > 0 ? ` - ${patchedCount}` : null}
                </Button>
                <Button
                  toggle
                  active={filters.added}
                  onClick={() => toggleFilter('added')}>
                  {i18n.t('ui.filters.added')}
                  {addedCount > 0 ? ` - ${addedCount}` : null}
                </Button>
                <Button
                  toggle
                  active={filters.notTranslated}
                  onClick={() => toggleFilter('notTranslated')}>
                  {i18n.t('ui.filters.untranslated')}
                  {notTranslatedCount > 0 ? ` - ${notTranslatedCount}` : null}
                </Button>
                <Button
                  toggle
                  active={onlyTranslated}
                  onClick={() => setOnlyTranslated((state) => !state)}>
                  {i18n.t('ui.filters.translated')}
                </Button>
              </Button.Group>
            </Menu.Item>
            {filtered && (
              <Menu.Item>
                <strong style={{ marginLeft: 10 }}>
                  {i18n.t('ui.list total songs', { total: filtered.length })}
                </strong>
              </Menu.Item>
            )}
            <SongListResume songs={songs} />
          </>
        )}
      </Menu>
      {!pdfUrl && !loading && (
        <>
          <div style={{ padding: 10 }}>
            <Input
              fluid
              icon="search"
              placeholder={i18n.t('ui.search placeholder')}
              onChange={(_, data) => {
                setSearchTerm(data.value);
                localStorage.setItem('searchTerm', JSON.stringify(data.value));
              }}
              defaultValue={searchTermDefaultValue}
              loading={filtering}
            />
            {filtered && filtered.length === 0 && (
              <Message>{i18n.t('ui.no songs found')}</Message>
            )}
          </div>
          <ApiMessage />
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
                            content={i18n.t(`search_title.${song.stage}`)}
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
                            content={i18n.t('ui.song version number', {
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
                            {i18n.t('ui.locale warning title')}
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
      {loading && (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Loader
            active
            inline="centered"
            size="large"
            content={i18n.t('ui.loading')}
            inverted={false}
          />
        </div>
      )}
      {pdfUrl && (
        <div style={{ padding: 3, overflow: 'scroll' }}>
          <SongViewPdf url={pdfUrl} settingsChanged={previewPdf} />
        </div>
      )}
    </>
  );
};

export default SongList;
