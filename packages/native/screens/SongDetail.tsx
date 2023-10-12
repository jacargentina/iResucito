import { useEffect } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSettingsStore } from '../hooks';
import { SongViewFrame } from './SongViewFrame';
import { SongsStackParamList } from '../navigation';

type SongDetailRouteProp = RouteProp<SongsStackParamList, 'SongDetail'>;

export const SongDetail = () => {
  const route = useRoute<SongDetailRouteProp>();
  const { keepAwake } = useSettingsStore();
  const { song } = route.params;

  useEffect(() => {
    if (keepAwake) {
      activateKeepAwakeAsync();
      return function () {
        deactivateKeepAwake();
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
