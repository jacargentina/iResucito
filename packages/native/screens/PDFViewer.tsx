import * as React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SongViewPdf } from './SongViewPdf';
import { RootStackParamList } from '../navigation';

type SongPreviewPdfRouteProp = RouteProp<RootStackParamList, 'SongPreviewPdf'>;

export const PDFViewer = () => {
  const route = useRoute<SongPreviewPdfRouteProp>();
  return <SongViewPdf uri={route.params.uri} />;
};
