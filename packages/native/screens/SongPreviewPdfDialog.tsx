import * as React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import ModalView from '../components/ModalView';
import I18n from '@iresucito/translations';
import SongViewPdf from './SongViewPdf';
import { RootStackParamList } from '../navigation/RootNavigator';

type SongPreviewRouteProp = RouteProp<RootStackParamList, 'SongPreviewPdf'>;

const SongPreviewPdfDialog = () => {
  const route = useRoute<SongPreviewRouteProp>();
  const { uri } = route.params;
  return (
    <ModalView title={I18n.t('screen_title.preview')}>
      <SongViewPdf uri={uri} />
    </ModalView>
  );
};

export default SongPreviewPdfDialog;
