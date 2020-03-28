// @flow
import React from 'react';
import SongViewPdf from './SongViewPdf';

const PDFViewer = (props: any) => {
  const { route } = props;
  return <SongViewPdf uri={route.params.uri} />;
};

export default PDFViewer;
