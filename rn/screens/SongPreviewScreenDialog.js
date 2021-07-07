// @flow
import * as React from 'react';
import { Text } from 'native-base';
import { useRoute } from '@react-navigation/native';
import ModalView from '../components/ModalView';
import I18n from '../../translations';
import SongViewFrame from './SongViewFrame';

const SongPreviewScreenDialog = (props: any): React.Node => {
  const route = useRoute();
  const { text, title, source, stage } = route.params.data;

  return (
    <ModalView
      left={
        <Text
          bold
          fontSize="md"
          mt="2"
          ml="4"
          style={{
            alignSelf: 'flex-start',
          }}>
          {I18n.t('screen_title.preview')}
        </Text>
      }>
      <SongViewFrame
        style={{ marginTop: 10 }}
        title={title}
        text={text}
        stage={stage}
        source={source}
      />
    </ModalView>
  );
};

export default SongPreviewScreenDialog;
