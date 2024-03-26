import { useState, useEffect } from 'react';
import { Header } from 'semantic-ui-react';
import i18n from '@iresucito/translations';
import { SongRendering } from '@iresucito/core';
import { WebParser, WebStyle, WebStyles } from './WebParser';
import SongViewLines from './SongViewLines';

const SongViewFrame = (props: any) => {
  const { title, source, text } = props;
  const [fRender, setFRender] = useState<SongRendering<WebStyle> | undefined>();

  useEffect(() => {
    const result = WebParser.getForRender(text, i18n.locale);
    setFRender(result);
  }, [text]);

  return (
    <>
      <Header style={WebStyles.title}>
        {title}
        <Header.Subheader style={WebStyles.source}>{source}</Header.Subheader>
      </Header>
      {fRender && (
        <SongViewLines lines={fRender.items} indicators={fRender.indicators} />
      )}
    </>
  );
};

export default SongViewFrame;
