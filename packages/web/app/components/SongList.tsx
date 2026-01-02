import { useMemo, useEffect, useState } from 'react';
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Alert,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  GetApp as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import SongViewPdf from '~/components/SongViewPdf';
import ApiMessage from '~/components/ApiMessage';
import SongListResume from '~/components/SongListResume';
import SongListItem from '~/components/SongListItem';
import { useDebounce } from 'use-debounce';
import { Song, colors, getPropertyLocale } from '@iresucito/core';
import i18n from '@iresucito/translations';
import { useApp } from '~/app.context';
import { useNavigate } from '@remix-run/react';
import { usePdf } from './PdfContext';

const SongList = (props: { songs: Array<Song> }) => {
  const { songs } = props;

  const {
    user,
    setApiResult,
    handleApiError,
    setActiveDialog,
    setDialogCallback,
  } = useApp();

  const navigate = useNavigate();

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

  const {
    previewPdf,
    pdf,
    loading: pdfLoading,
    numPages,
    currPage,
    setCurrPage,
    downloadPdf,
    closePdf,
  } = usePdf();

  const isProcessing = loading || pdfLoading;

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
    setFilters((currentFilters: any) => {
      const newFilters = { ...currentFilters, [name]: !currentFilters[name] };
      localStorage.setItem('filters', JSON.stringify(newFilters));
      return newFilters;
    });
  };

  const edit = (song: Song) => {
    setLoading(true);
    navigate(`/edit/${song.key}`);
  };

  const addSong = () => {
    setApiResult();
    fetch(`/song/newSong`)
      .then((result) => result.json())
      .then((data) => {
        edit(data.song);
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  const removePatch = (song: Song) => {
    setDialogCallback(() => {
      fetch(`/song/${song.key}`, { method: 'DELETE' })
        .then((result) => result.json())
        .then(() => {
          setApiResult({ ok: i18n.t('ui.patch removed') });
        })
        .catch((err) => {
          handleApiError(err);
        });
    });
    setActiveDialog('confirm');
  };

  useEffect(() => {
    setFiltering(true);
    const filtered = songs.filter((song: Song) => {
      if (
        filters.patched &&
        filters.added &&
        filters.notTranslated &&
        onlyTranslated
      ) {
        return (
          (song.titulo.toLowerCase().includes(debouncedTerm) ||
            song.fuente.toLowerCase().includes(debouncedTerm)) &&
          (song.patched || song.added) &&
          !song.notTranslated &&
          getPropertyLocale(song.files, i18n.locale)
        );
      }

      if (filters.patched || filters.added || filters.notTranslated) {
        return (
          (song.titulo.toLowerCase().includes(debouncedTerm) ||
            song.fuente.toLowerCase().includes(debouncedTerm)) &&
          ((filters.patched && song.patched) ||
            (filters.added && song.added) ||
            (filters.notTranslated && song.notTranslated))
        );
      }

      if (onlyTranslated) {
        return (
          (song.titulo.toLowerCase().includes(debouncedTerm) ||
            song.fuente.toLowerCase().includes(debouncedTerm)) &&
          getPropertyLocale(song.files, i18n.locale)
        );
      }

      return (
        song.titulo.toLowerCase().includes(debouncedTerm) ||
        song.fuente.toLowerCase().includes(debouncedTerm)
      );
    });
    setFiltered(filtered);
    setFiltering(false);
  }, [debouncedTerm, filters, onlyTranslated]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Toolbar */}
      <Paper sx={{ p: 1, mb: 1 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
          <TextField
            placeholder={i18n.t('ui.search placeholder')}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={addSong}
            disabled={!user || isProcessing}>
            {i18n.t('ui.create')}
          </Button>
          <Button
            variant="outlined"
            startIcon={<PdfIcon />}
            onClick={() => previewPdf('', '')}
            disabled={isProcessing}>
            {i18n.t('share_action.view pdf')}
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.patched}
                onChange={() => toggleFilter('patched')}
              />
            }
            label={`${i18n.t('ui.filters.patched')} (${patchedCount})`}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.added}
                onChange={() => toggleFilter('added')}
              />
            }
            label={`${i18n.t('ui.filters.added')} (${addedCount})`}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.notTranslated}
                onChange={() => toggleFilter('notTranslated')}
              />
            }
            label={`${i18n.t(
              'ui.filters.untranslated'
            )} (${notTranslatedCount})`}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={onlyTranslated}
                onChange={(e) => setOnlyTranslated(e.target.checked)}
              />
            }
            label={i18n.t('ui.filters.translated')}
          />
          <Box sx={{ ml: 'auto' }}>
            <SongListResume songs={filtered} />
          </Box>
        </Box>
      </Paper>

      {/* Message Areas */}
      <Box sx={{ px: 1, mb: 1 }}>
        <ApiMessage />
      </Box>

      {/* Songs List */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 1 }}>
        {filtering && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!filtering && filtered && filtered.length === 0 && (
          <Alert severity="info">{i18n.t('ui.empty songs list')}</Alert>
        )}

        {!filtering && filtered && (
          <List>
            {filtered.map((song) => (
              <Paper key={song.key} sx={{ mb: 1 }}>
                <ListItem
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {song.patched && (
                        <Tooltip title={i18n.t('ui.remove patch')}>
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => removePatch(song)}
                            disabled={!user}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={i18n.t('ui.preview pdf')}>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => previewPdf(song.key, '')}>
                          <PdfIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={i18n.t('ui.edit')}>
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => edit(song)}
                          disabled={!user || isProcessing}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }>
                  <ListItemIcon>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {song.patched && (
                        <Chip
                          label="Patched"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      {song.added && (
                        <Chip
                          label="Added"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                      {song.notTranslated && (
                        <Chip
                          label="No Translated"
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </ListItemIcon>
                  <ListItemText primary={song.titulo} secondary={song.fuente} />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default SongList;
