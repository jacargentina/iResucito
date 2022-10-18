import * as React from 'react';
import { useEffect } from 'react';
import KeepAwake from 'react-native-keep-awake';
import { useRoute } from '@react-navigation/native';
import { useData } from '../DataContext';
import SongViewFrame from './SongViewFrame';

const SongDetail = (props: any) => {
  const data = useData();
  const route = useRoute();
  const [keepAwake] = data.keepAwake;

  var song: Song = route.params.song;

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
