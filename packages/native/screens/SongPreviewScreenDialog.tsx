import type { RouteProp } from '@react-navigation/native';
import { Text } from '@gluestack-ui/themed';
import { useRoute } from '@react-navigation/native';
import { ModalView } from '../components';
import i18n from '@iresucito/translations';
import { SongViewFrame } from './SongViewFrame';

import type { ChooserParamList } from '../navigation/SongChooserNavigator';

type SongPreviewRouteProp = RouteProp<ChooserParamList, 'ViewSong'>;

export const SongPreviewScreenDialog = () => {
  const route = useRoute<SongPreviewRouteProp>();
  const { song } = route.params;

  return (
    <ModalView
      left={
        <Text
          fontWeight="bold"
          fontSize="$md"
          mt="$2"
          ml="$4"
          style={{
            alignSelf: 'flex-start',
          }}>
          {i18n.t('screen_title.preview')}
        </Text>
      }>
      <SongViewFrame style={{ marginTop: 10 }} song={song} />
    </ModalView>
  );
};
