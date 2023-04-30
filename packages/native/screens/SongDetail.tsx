import * as React from 'react';
import { useEffect } from 'react';
import KeepAwake from 'react-native-keep-awake';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSettingsStore } from '../hooks';
import SongViewFrame from './SongViewFrame';
import { SongsStackParamList } from '../navigation/SongsNavigator';

type SongDetailRouteProp = RouteProp<SongsStackParamList, 'SongDetail'>;

const SongDetail = () => {
  const route = useRoute<SongDetailRouteProp>();
  const { keepAwake } = useSettingsStore();
  const { song } = route.params;

  useEffect(() => {
    if (keepAwake) {
      KeepAwake.activate();
      return function () {
        KeepAwake.deactivate();
      };
    }
  }, [keepAwake]);

  return (
    <SongViewFrame
      title={song.titulo}
      source={song.fuente}
      stage={song.stage}
      text={song.fullText}
      error={song.error}
      transportToNote={song.transportTo}
    />
  );
};

export default SongDetail;
