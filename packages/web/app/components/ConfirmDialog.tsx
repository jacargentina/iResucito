import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useApp } from '~/app.context';
import i18n from '@iresucito/translations';

const ConfirmDialog = () => {
  const app = useApp();
  const { confirmData, setConfirmData } = app;

  const handleClose = (runYesHandler: boolean) => {
    if (runYesHandler === true) {
      confirmData?. yes();
    }
    setConfirmData();
  };

  return (
    <Dialog
      open={confirmData !== undefined}
      maxWidth="sm"
      fullWidth>
      <DialogTitle>Confirmación</DialogTitle>
      <DialogContent>
        <h3>{confirmData ?  confirmData.message : ''}</h3>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleClose(true)}>
          {i18n.t('ui.yes')}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleClose(false)}>
          {i18n.t('ui.no')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;