import * as React from 'react';
import { useRoute } from '@react-navigation/native';
import SongViewPdf from './SongViewPdf';

const PDFViewer = () =>{
  const route = useRoute();
  return <SongViewPdf uri={route.params.uri} />;
};

export default PDFViewer;