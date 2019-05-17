// @flow
import React, { Fragment } from 'react';
import { textToLines } from '../../src/common';
import { WebStyles } from './WebParser';
import SongViewLines from './SongViewLines';
import { Header } from 'semantic-ui-react';

const SongViewFrame = (props: any) => {
  const { title, source, text } = props;

  if (!text) {
    return null;
  }

  const lines = textToLines(text);

  return (
    <Fragment>
      <Header style={WebStyles.titulo}>
        {title}
        <Header.Subheader style={WebStyles.fuente}>{source}</Header.Subheader>
      </Header>
      <SongViewLines lines={lines} />
    </Fragment>
  );
};

export default SongViewFrame;
