// @flow
import * as React from 'react';
import { View } from 'react-native';
import ViewPdfButton from '../components/ViewPdfButton';
import TransportNotesButton from '../components/TransportNotesButton';

const SongDetailOptions = ({ navigation, route }: any): any => {
  const song = route.params.song;
  return {
    title: song ? song.titulo : 'Salmo',
    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        <ViewPdfButton />
        <TransportNotesButton />
      </View>
    ),
  };
};

export default SongDetailOptions;
