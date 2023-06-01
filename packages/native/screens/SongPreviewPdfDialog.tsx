import * as React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ModalView } from '../components';
import i18n from '@iresucito/translations';
import { SongViewPdf } from './SongViewPdf';
import { RootStackParamList } from '../navigation';

type SongPreviewRouteProp = RouteProp<RootStackParamList, 'SongPreviewPdf'>;

export const SongPreviewPdfDialog = () => {
  const route = useRoute<SongPreviewRouteProp>();
  const { uri } = route.params;
  return (
    <ModalView title={i18n.t('screen_title.preview')}>
      <SongViewPdf uri={uri} />
    </ModalView>
  );
};
