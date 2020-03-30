// @flow
import React from 'react';
import ModalView from './ModalView';
import SongViewPdf from './SongViewPdf';
import I18n from '../../translations';
import { useRoute } from '@react-navigation/native';

const SongPreviewPdfDialog = (props: any) => {
  const route = useRoute();
  const { uri } = route.params;
  return (
    <ModalView title={I18n.t('screen_title.preview')}>
      <SongViewPdf uri={uri} />
    </ModalView>
  );
};

export default SongPreviewPdfDialog;
