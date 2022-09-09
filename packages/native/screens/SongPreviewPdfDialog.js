// @flow
import * as React from 'react';
import { useRoute } from '@react-navigation/native';
import ModalView from '../components/ModalView';
import I18n from '@iresucito/translations';
import SongViewPdf from './SongViewPdf';

const SongPreviewPdfDialog = (props: any): React.Node => {
  const route = useRoute();
  const { uri } = route.params;
  return (
    <ModalView title={I18n.t('screen_title.preview')}>
      <SongViewPdf uri={uri} />
    </ModalView>
  );
};

export default SongPreviewPdfDialog;
