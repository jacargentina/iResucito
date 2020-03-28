// @flow
import React, { useContext, useEffect, useState } from 'react';
import KeepAwake from 'react-native-keep-awake';
import { DataContext } from '../DataContext';
import SongViewFrame from './SongViewFrame';

const SongDetail = (props: any) => {
  const data = useContext(DataContext);
  const [keepAwake] = data.keepAwake;
  const { navigation, route } = props;
  const [transportNote, setTransportNote] = useState();

  var song: Song = route.params.song;

  useEffect(() => {
    navigation.setParams({ transportNote, setTransportNote });
  }, [navigation, transportNote, setTransportNote]);

  useEffect(() => {
    if (keepAwake) {
      KeepAwake.activate();
      return function() {
        KeepAwake.deactivate();
      };
    }
  }, []);

  return (
    <SongViewFrame
      title={song.titulo}
      source={song.fuente}
      stage={song.stage}
      text={song.fullText}
      error={song.error}
      transportToNote={transportNote}
    />
  );
};

export default SongDetail;
