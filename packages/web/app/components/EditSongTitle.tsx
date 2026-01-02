import { useContext } from 'react';
import { Box, Typography } from '@mui/material';
import { EditContext } from './EditContext';
import i18n from '@iresucito/translations';

const EditSongTitle = () => {
  const edit = useContext(EditContext);

  if (!edit) {
    return null;
  }

  const { editSong, songFile, stage } = edit;

  if (!editSong) {
    return null;
  }

  const st =
    stage ||
    editSong.stage ||
    (editSong.stages && editSong.stages[i18n.locale]);

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {songFile && (
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
          {songFile.titulo.toUpperCase()}
        </Typography>
      )}
      {songFile?.fuente && (
        <Typography variant="body2">{songFile.fuente}</Typography>
      )}
      {st && (
        <Typography variant="body2">{i18n.t(`search_title.${st}`)}</Typography>
      )}
    </Box>
  );
};

export default EditSongTitle;
