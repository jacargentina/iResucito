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
import SongListItem from './SongListItem';

const SongChangeMetadataDialog = () => {
  const app = useApp();
  const { activeDialog, setActiveDialog } = app;
  const edit = useContext(EditContext);

  if (!edit) {
    return null;
  }

  const { editSong, setStage, setName } = edit;
  const [metadata, setMetadata] = useState({
    titulo: editSong.titulo,
    fuente: editSong.fuente,
    stage: editSong.stage,
  });

  const handleClose = (save: boolean) => {
    if (save) {
      setStage(metadata.stage);
      if (metadata.fuente) {
        setName(metadata.titulo + ' - ' + metadata.fuente);
      } else {
        setName(metadata.titulo);
      }
    }
    setActiveDialog();
  };

  const stages = ['precatechumenate', 'liturgy', 'catechumenate', 'election'];

  return (
    <Dialog
      open={activeDialog === 'changeMetadata'}
      maxWidth="sm"
      fullWidth
      onClose={() => handleClose(false)}>
      <DialogTitle>{i18n.t('ui.edit')}</DialogTitle>
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
            <InputLabel>{i18n.t('ui.stage')}</InputLabel>
            <Select
              value={metadata.stage || ''}
              onChange={(e) =>
                setMetadata({ ...metadata, stage: e.target.value })
              }
              label={i18n.t('ui.stage')}>
              {stages.map((stage) => (
                <MenuItem key={stage} value={stage}>
                  {i18n.t(`search_title.${stage}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ pt: 2, pb: 1, fontWeight: 'bold' }}>
          {i18n.t('screen_title.preview')}
        </Box>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
          <div style={{ flex: 1, padding: 2 }}>
            <h5>{i18n.t('ui.original song')}</h5>
            {editSong && (
              <SongListItem
                titulo={editSong.titulo}
                fuente={editSong.fuente}
                stage={editSong.stage}
              />
            )}
          </div>
          <div style={{ flex: 1, padding: 2 }}>
            <h5>{i18n.t('ui.patched song')}</h5>
            {metadata && (
              <SongListItem
                titulo={metadata.titulo}
                fuente={metadata.fuente}
                stage={metadata.stage}
              />
            )}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleClose(true)}>
          {i18n.t('ui.apply')}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleClose(false)}>
          {i18n.t('ui.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SongChangeMetadataDialog;
