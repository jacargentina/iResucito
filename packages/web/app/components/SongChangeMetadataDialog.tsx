import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useContext, useState } from 'react';
import { EditContext } from './EditContext';
import i18n from '@iresucito/translations';
import { useApp } from '~/app.context';

const SongChangeMetadataDialog = () => {
  const app = useApp();
  const { activeDialog, setActiveDialog } = app;
  const edit = useContext(EditContext);

  if (!edit) {
    return null;
  }

  const { editSong, setSongMetadata } = edit;
  const [metadata, setMetadata] = useState({
    titulo: editSong.titulo,
    fuente: editSong.fuente,
    stage: editSong.stage,
  });

  const handleClose = (save: boolean) => {
    if (save) {
      setSongMetadata(metadata);
    }
    setActiveDialog();
  };

  const stages = ['pentecostes', 'epifania', 'pascua', 'navidad', 'adviento'];

  return (
    <Dialog
      open={activeDialog === 'changeMetadata'}
      maxWidth="sm"
      fullWidth
      onClose={() => handleClose(false)}>
      <DialogTitle>{i18n.t('ui. edit metadata')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label={i18n.t('ui.title')}
            value={metadata.titulo}
            onChange={(e) =>
              setMetadata({ ...metadata, titulo: e.target.value })
            }
            variant="outlined"
          />

          <TextField
            fullWidth
            label={i18n.t('ui.source')}
            value={metadata.fuente}
            onChange={(e) =>
              setMetadata({ ...metadata, fuente: e.target.value })
            }
            variant="outlined"
          />

          <FormControl fullWidth>
            <InputLabel>{i18n.t('ui. stage')}</InputLabel>
            <Select
              value={metadata.stage || ''}
              onChange={(e) =>
                setMetadata({ ...metadata, stage: e.target.value })
              }
              label={i18n.t('ui.stage')}>
              <MenuItem value="">
                <em>{i18n.t('ui. none')}</em>
              </MenuItem>
              {stages.map((stage) => (
                <MenuItem key={stage} value={stage}>
                  {i18n.t(`search_title.${stage}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>
          {i18n.t('ui.cancel')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleClose(true)}>
          {i18n.t('ui. save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SongChangeMetadataDialog;
