import { useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Box,
  Paper,
} from '@mui/material';
import { EditContext } from './EditContext';
import i18n from '@iresucito/translations';
import { useApp } from '~/app.context';

const PatchLogDialog = () => {
  const app = useApp();
  const { activeDialog, setActiveDialog } = app;
  const edit = useContext(EditContext);

  if (!edit) {
    return null;
  }

  const { editSong, patchLogs } = edit;

  return (
    <Dialog
      open={activeDialog === 'patchLog'}
      maxWidth="lg"
      fullWidth
      onClose={() => setActiveDialog()}>
      <DialogTitle>{i18n.t('ui.patch log')}</DialogTitle>
      <DialogContent>
        {editSong && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            {editSong.titulo.toUpperCase()}
          </Typography>
        )}

        {patchLogs &&
          patchLogs.changes.length === 0 &&
          ! patchLogs.pending && (
            <Alert severity="info">{i18n.t('ui.no items to show')}</Alert>
          )}

        {patchLogs && patchLogs.changes.length > 0 && (
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#000', color: '#fff' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                    User
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                    Changes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patchLogs.changes.map((item) => {
                  const details = [];
                  if (item.created) details.push('Created');
                  if (item.rename)
                    details.push(
                      `Renamed from ${item.rename.original} to ${item.rename.new}`
                    );
                  if (item.linked) details.push(`Linked ${item.linked. new}`);
                  if (item.updated) details.push('Updated text');
                  if (item. staged)
                    details.push(
                      `Staged from ${item.staged.original} to ${item.staged.new}`
                    );

                  return (
                    <TableRow key={item.date}>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>
                        {new Date(item.date).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Box component="ul" sx={{ pl: 2, my: 0 }}>
                          {details. map((detail, idx) => (
                            <Box component="li" key={idx}>
                              {detail}
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {patchLogs && patchLogs.pending && (
          <Alert severity="warning">
            {i18n.t('ui.patch pending', {
              author: patchLogs.pending.author,
              date: new Date(patchLogs.pending.date).toLocaleString(),
            })}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={() => setActiveDialog()}>
          {i18n. t('ui.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatchLogDialog;