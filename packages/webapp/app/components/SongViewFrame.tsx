import { useState, useEffect } from 'react';
import { Header } from 'semantic-ui-react';
import { WebParser, WebStyles } from './WebParser';
import SongViewLines from './SongViewLines';
import I18n from '~/translations';

const SongViewFrame = (props: any) => {
  const { title, source, text } = props;
  const [fRender, setFRender] = useState<SongRendering | undefined>();

  useEffect(() => {
    const result = WebParser.getForRender(text, I18n.locale);
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
