import { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import i18n from '@iresucito/translations';
import { getPropertyLocale, Song } from '@iresucito/core';

const emptyResume = {
  text: '-',
  values: { total: 0, translated: 0 },
};

const SongListResume = (props: any) => {
  const { songs } = props;
  const [resume, setResume] = useState(emptyResume);

  useEffect(() => {
    if (songs) {
      const withLocale = songs.filter((song: Song) => {
        return song.patched || !!getPropertyLocale(song. files, i18n.locale);
      });
      const result = { translated: withLocale.length, total: songs.length };
      setResume({
        text: i18n.t('ui.translated songs', result),
        values: result,
      });
    } else {
      setResume(emptyResume);
    }
  }, [songs]);

  const percentage =
    resume.values.total > 0
      ? Math.round((resume.values.translated / resume.values.total) * 100)
      : 0;

  return (
    <Box
      sx={{
        ml: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
      <Typography variant="body2">{resume.text}</Typography>
      <Box sx={{ width: 250 }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#4caf50',
            },
          }}
        />
        <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
          {percentage}%
        </Typography>
      </Box>
    </Box>
  );
};

export default SongListResume;