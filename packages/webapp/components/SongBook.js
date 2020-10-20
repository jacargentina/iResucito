// @flow
import React from 'react';
import SongViewPdf from './SongViewPdf';

const SongBook = (props: any) => {
  const { url } = props;

  return (
    <div style={{ margin: '0 auto', padding: 20, overflow: 'scroll' }}>
      <SongViewPdf url={url} />
    </div>
  );
};

export default SongBook;
