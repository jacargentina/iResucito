import { useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { EditContext } from './EditContext';
import i18n from '@iresucito/translations';
import { useApp } from '~/app.context';

const DiffViewDialog = () => {
  const app = useApp();
  const { activeDialog, setActiveDialog } = app;
  const edit = useContext(EditContext);

  if (!edit) {
    return null;
  }

  const { editSong, diffView } = edit;

  return (
    <Dialog
      open={activeDialog === 'diffView'}
      maxWidth="lg"
      fullWidth
      onClose={() => setActiveDialog()}>
      <DialogTitle>{i18n.t('ui.diff view')}</DialogTitle>
      <DialogContent sx={{ maxHeight: '500px', overflowY: 'auto' }}>
        {editSong && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editSong.titulo.toUpperCase()}
          </Typography>
        )}
        <Box sx={{ flex: 1 }}>
          {diffView?.map((item, i) => {
            const color = item.added ? 'green' : item.removed ? 'red' : '#666';
            const val = item.value.replace(/\n/g, '<br/>');
            return (
              <Typography
                key={i}
                component="span"
                sx={{
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  color: color,
                  display: 'block',
                }}
                dangerouslySetInnerHTML={{ __html: val }}
              />
            );
          })}
          {diffView == null && (
            <Typography color="textSecondary">No diff</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => setActiveDialog()}>
          {i18n.t('ui.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DiffViewDialog;
