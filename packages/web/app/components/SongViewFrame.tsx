import { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import i18n from '@iresucito/translations';
import { SongRendering } from '@iresucito/core';
import { WebParser, WebStyle, WebStyles } from './WebParser';
import SongViewLines from './SongViewLines';

const SongViewFrame = (props: any) => {
  const { title, source, text } = props;
  const [fRender, setFRender] = useState<SongRendering<WebStyle> | undefined>();

  useEffect(() => {
    const result = WebParser. getForRender(text, i18n.locale);
    setFRender(result);
  }, [text]);

  return (
    <>
      <Box sx={WebStyles.title}>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="subtitle2" sx={WebStyles.source}>
          {source}
        </Typography>
      </Box>
      {fRender && (
        <SongViewLines lines={fRender.items} indicators={fRender.indicators} />
      )}
    </>
  );
};

export default SongViewFrame;