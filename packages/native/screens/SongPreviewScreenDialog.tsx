import * as React from 'react';
import type { RouteProp } from '@react-navigation/native';
import { Text } from 'native-base';
import { useRoute } from '@react-navigation/native';
import ModalView from '../components/ModalView';
import I18n from '@iresucito/translations';
import SongViewFrame from './SongViewFrame';

import type { ChooserParamList } from '../navigation/SongChooserNavigator';

type SongPreviewRouteProp = RouteProp<ChooserParamList, 'ViewSong'>;

const SongPreviewScreenDialog = () => {
  const route = useRoute<SongPreviewRouteProp>();
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
          }}
        >
          {I18n.t('screen_title.preview')}
        </Text>
      }
    >
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
