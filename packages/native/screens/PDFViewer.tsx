import * as React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import SongViewPdf from './SongViewPdf';
import { RootStackParamList } from '../navigation/RootNavigator';

type SongPreviewPdfRouteProp = RouteProp<RootStackParamList, 'SongPreviewPdf'>;

const PDFViewer = () => {
  const route = useRoute<SongPreviewPdfRouteProp>();
  return <SongViewPdf uri={route.params.uri} />;
};

export default PDFViewer;
