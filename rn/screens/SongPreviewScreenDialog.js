// @flow
import React from 'react';
import { Text } from 'native-base';
import SongViewFrame from './SongViewFrame';
import ModalView from './ModalView';
import I18n from '../../translations';
import commonTheme from '../native-base-theme/variables/platform';

const SongPreviewScreenDialog = (props: any) => {
  const { navigation } = props;
  const { text, title, source, stage } = navigation.getParam('data');

  return (
    <ModalView
      left={
        <Text
          style={{
            alignSelf: 'flex-start',
            marginLeft: 10,
            fontSize: commonTheme.fontSizeBase + 3,
            fontWeight: 'bold'
          }}>
          {I18n.t('screen_title.preview')}
        </Text>
      }>
      <SongViewFrame title={title} text={text} stage={stage} source={source} />
    </ModalView>
  );
};

export default SongPreviewScreenDialog;
