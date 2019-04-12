// @flow
import React from 'react';
import SongViewFrame from './SongViewFrame';
import ModalView from './ModalView';
import I18n from '../translations';

const SongPreviewScreenDialog = (props: any) => {
  const { navigation } = props;
  const { lines, locale, titulo, fuente, etapa } = navigation.getParam('data');
  return (
    <ModalView title={I18n.t('screen_title.preview')}>
      <SongViewFrame
        lines={lines}
        locale={locale}
        titulo={titulo}
        fuente={fuente}
        etapa={etapa}
      />
    </ModalView>
  );
};

export default SongPreviewScreenDialog;
