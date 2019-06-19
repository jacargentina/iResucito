// @flow
import React from 'react';
import SongViewFrame from './SongViewFrame';
import ModalView from './ModalView';
import I18n from '../../translations';

const SongPreviewScreenDialog = (props: any) => {
  const { navigation } = props;
  const { text, titulo, fuente, stage } = navigation.getParam('data');

  return (
    <ModalView title={I18n.t('screen_title.preview')}>
      <SongViewFrame
        text={text}
        titulo={titulo}
        fuente={fuente}
        stage={stage}
      />
    </ModalView>
  );
};

export default SongPreviewScreenDialog;
