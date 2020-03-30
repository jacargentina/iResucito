// @flow
import React from 'react';
import SongViewPdf from './SongViewPdf';
import { useRoute } from '@react-navigation/native';

const PDFViewer = () => {
  const route = useRoute();
  return <SongViewPdf uri={route.params.uri} />;
};

export default PDFViewer;
