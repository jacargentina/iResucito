import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { EditContext } from './EditContext';
import i18n from '@iresucito/translations';
import { useApp } from '~/app.context';

const PdfSettingsDialog = () => {
  const app = useApp();
  const { activeDialog, setActiveDialog } = app;
  const edit = useContext(EditContext);

  if (!edit) {
    return null;
  }

  const { pdfSettings, setPdfSettings } = edit;
  const [settings, setSettings] = useState(pdfSettings);

  const handleClose = (save: boolean) => {
    if (save) {
      setPdfSettings(settings);
    }
    setActiveDialog();
  };

  return (
    <Dialog
      open={activeDialog === 'pdfSettings'}
      maxWidth="sm"
      fullWidth
      onClose={() => handleClose(false)}>
      <DialogTitle>{i18n.t('ui.pdf settings')}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={settings.landscape || false}
                onChange={(e) =>
                  setSettings({ ...settings, landscape: e.target.checked })
                }
              />
            }
            label={i18n.t('ui.landscape')}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={settings.twoColumns || false}
                onChange={(e) =>
                  setSettings({ ...settings, twoColumns: e.target.checked })
                }
              />
            }
            label={i18n.t('ui.two columns')}
          />

          <TextField
            label={i18n.t('ui.font size')}
            type="number"
            size="small"
            value={settings.fontSize || 12}
            onChange={(e) =>
              setSettings({ ...settings, fontSize: parseInt(e.target.value) })
            }
            inputProps={{ min: 8, max: 20 }}
          />

          <TextField
            label={i18n.t('ui.line height')}
            type="number"
            size="small"
            value={settings.lineHeight || 1.5}
            onChange={(e) =>
              setSettings({
                ...settings,
                lineHeight: parseFloat(e.target.value),
              })
            }
            inputProps={{ min: 1, max: 3, step: 0.1 }}
          />
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
          {i18n.t('ui.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PdfSettingsDialog;
