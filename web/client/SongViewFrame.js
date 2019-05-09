// @flow
import React from 'react';
import { textToLines } from '../../src/common';
import SongViewLines from './SongViewLines';

const SongViewFrame = (props: any) => {
  const { text } = props;

  if (!text) {
    return null;
  }

  const lines = textToLines(text);

  return <SongViewLines lines={lines} />;
};

export default SongViewFrame;
