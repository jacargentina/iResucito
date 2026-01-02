import { useContext, useState, useEffect, useRef } from 'react';
import {
  TextField,
  IconButton,
  Tooltip,
  Paper,
  Box,
  Tabs,
  Tab,
  Typography,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useDebouncedCallback } from 'use-debounce';
import { EditContext } from './EditContext';
import { usePdf } from './PdfContext';
import ApiMessage from './ApiMessage';
import SongViewFrame from './SongViewFrame';
import SongViewPdf from './SongViewPdf';
import i18n from '@iresucito/translations';
import { useApp } from '~/app.context';
import Split from 'react-split';

const SongEditor = () => {
  const txtRef = useRef<any>(null);
  const app = useApp();
  const { setActiveDialog, apiResult, setDialogCallback } = app;

  const edit = useContext(EditContext);

  if (!edit) {
    return null;
  }

  const {
    editSong,
    index,
    previousKey,
    nextKey,
    totalSongs,
    text,
    setText,
    setHasChanges,
    songFile,
    confirmRemovePatch,
    hasChanges,
    applyChanges,
    goPrevious,
    goNext,
    confirmClose,
  } = edit;

  const { previewPdf, downloadPdf } = usePdf();

  const [debouncedText, setDebouncedText] = useState(text);
  const debounced = useDebouncedCallback((t) => setDebouncedText(t), 800);
  const [linepos, setLinepos] = useState<number>();
  const [colpos, setColpos] = useState<number>();
  const [viewType, setViewType] = useState<'html' | 'pdf'>('html');

  useEffect(() => {
    setDebouncedText(editSong.fullText);
    setText(editSong.fullText);
    setLinepos(1);
    setColpos(1);
    if (txtRef && txtRef.current) {
      txtRef.current.focus();
    }
  }, [editSong]);

  const editMetadata = () => {
    if (app.user) {
      setActiveDialog('changeMetadata');
    }
  };

  const save = () => {
    if (app.user && hasChanges) {
      applyChanges();
    }
  };

  const previous = () => {
    goPrevious();
  };

  const next = () => {
    goNext();
  };

  const txtPositionEvent = () => {
    if (txtRef && txtRef.current) {
      const textarea = txtRef.current;
      const line = textarea.value
        .substr(0, textarea.selectionStart)
        .split('\n').length;
      const col =
        textarea.selectionStart -
        textarea.value.lastIndexOf('\n', textarea.selectionStart - 1);
      setLinepos(line);
      setColpos(col);
    }
  };

  useEffect(() => {
    if (viewType === 'pdf') {
      previewPdf(editSong.key, debouncedText);
    }
  }, [viewType, debouncedText]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Toolbar */}
      <Paper sx={{ p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Tooltip title={i18n.t('ui.edit metadata')}>
          <IconButton size="small" onClick={editMetadata}>
            <EditIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={`${i18n.t('ui.save')} (Ctrl+S)`}>
          <span>
            <IconButton
              size="small"
              onClick={save}
              disabled={!hasChanges}
              color={hasChanges ? 'primary' : 'default'}>
              <SaveIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={i18n.t('ui.close')}>
          <IconButton size="small" onClick={confirmClose}>
            <CloseIcon />
          </IconButton>
        </Tooltip>

        <Box sx={{ flex: 1 }} />

        <Tooltip title={`${i18n.t('ui.previous')} (Ctrl+[)`}>
          <span>
            <IconButton size="small" onClick={previous} disabled={!previousKey}>
              <PrevIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Typography variant="body2" sx={{ mx: 1 }}>
          {index + 1} / {totalSongs}
        </Typography>

        <Tooltip title={`${i18n.t('ui.next')} (Ctrl+])`}>
          <span>
            <IconButton size="small" onClick={next} disabled={!nextKey}>
              <NextIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title={i18n.t('ui.preview pdf')}>
          <IconButton
            size="small"
            onClick={() => previewPdf(editSong.key, debouncedText)}>
            <PdfIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={i18n.t('ui.download pdf')}>
          <IconButton
            size="small"
            onClick={() => downloadPdf(editSong.key, debouncedText)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Content Area */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Split
          style={{
            display: 'flex',
            width: '100%',
          }}
          sizes={[50, 50]}>
          {/* Editor */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
            <TextField
              inputRef={txtRef}
              multiline
              fullWidth
              maxRows={999}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setHasChanges(true);
                debounced(e.target.value);
              }}
              onSelect={txtPositionEvent}
              sx={{ flex: 1, fontFamily: 'monospace' }}
            />
            <Box
              sx={{
                p: 1,
                backgroundColor: '#f5f5f5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Typography variant="caption">
                Line: {linepos} | Col: {colpos}
              </Typography>
              {hasChanges && (
                <Chip
                  label={i18n.t('ui.unsaved changes')}
                  size="small"
                  color="warning"
                />
              )}
            </Box>
          </Box>

          {/* Preview */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderLeft: '1px solid #ddd',
            }}>
            <Box sx={{ borderBottom: '1px solid #ddd' }}>
              <Tabs
                value={viewType}
                onChange={(_, newValue) => setViewType(newValue)}
                size="small">
                <Tab label="HTML" value="html" />
                <Tab label="PDF" value="pdf" />
              </Tabs>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              {viewType === 'html' && (
                <SongViewFrame
                  title={songFile?.titulo}
                  source={songFile?.fuente}
                  text={debouncedText}
                />
              )}
              {viewType === 'pdf' && <SongViewPdf />}
            </Box>
          </Box>
        </Split>
      </Box>

      {/* Messages */}
      {apiResult && (
        <Box sx={{ p: 1 }}>
          <ApiMessage />
        </Box>
      )}
    </Box>
  );
};

export default SongEditor;
