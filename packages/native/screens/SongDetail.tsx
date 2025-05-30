import { useEffect } from 'react';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSettingsStore } from '../hooks';
import { SongViewFrame } from './SongViewFrame';
import { SongsStackParamList } from '../navigation/SongsNavigator';
import { DismissableBottom } from '../components';

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
    <DismissableBottom>
      <SongViewFrame song={song} />
    </DismissableBottom>
  );
};
