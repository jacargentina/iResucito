// @flow
import React, { Fragment } from 'react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import { WebParser, WebStyles } from './WebParser';
import SongViewLines from './SongViewLines';
import I18n from '../../translations';

const SongViewFrame = (props: any) => {
  const { title, source, text } = props;

  const fRender = WebParser.getForRender(text, I18n.locale);

  return (
    <Fragment>
      <Header style={WebStyles.titulo}>
        {title}
        <Header.Subheader style={WebStyles.fuente}>{source}</Header.Subheader>
      </Header>
      {fRender.clamp && (
        <p style={WebStyles.fuente}>
          {I18n.t('songs.clamp', { clamp: fRender.clamp })}
        </p>
      )}
      <SongViewLines lines={fRender.lines} />
    </Fragment>
  );
};

export default SongViewFrame;
