// @flow
import React, { Fragment, useState, useEffect } from 'react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import { WebParser, WebStyles } from './WebParser';
import SongViewLines from './SongViewLines';
import I18n from '../../../translations';

const SongViewFrame = (props: any) => {
  const { title, source, text } = props;
  const [fRender, setFRender] = useState<?SongRendering>();

  useEffect(() => {
    const result = WebParser.getForRender(text, I18n.locale);
    setFRender(result);
  }, [text]);

  return (
    <Fragment>
      <Header style={WebStyles.title}>
        {title}
        <Header.Subheader style={WebStyles.source}>{source}</Header.Subheader>
      </Header>
      {fRender && (
        <SongViewLines lines={fRender.items} indicators={fRender.indicators} />
      )}
    </Fragment>
  );
};

export default SongViewFrame;
