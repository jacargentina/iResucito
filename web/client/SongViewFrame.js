// @flow
import React, { Fragment } from 'react';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import { textToLines } from '../../src/common';
import { WebStyles } from './WebParser';
import SongViewLines from './SongViewLines';

const SongViewFrame = (props: any) => {
  const { title, source, text } = props;
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
