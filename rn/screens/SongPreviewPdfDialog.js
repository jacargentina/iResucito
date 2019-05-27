// @flow
import React from 'react';
import ModalView from './ModalView';
import SongViewPdf from './SongViewPdf';
import I18n from '../../translations';

const SongPreviewPdfDialog = (props: any) => {
  const { navigation } = props;
  const uri = navigation.getParam('uri');
  return (
    <ModalView title={I18n.t('screen_title.preview')}>
      <SongViewPdf uri={uri} />
    </ModalView>
  );
};

export default SongPreviewPdfDialog;
