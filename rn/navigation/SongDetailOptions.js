// @flow
import React from 'react';
import { View } from 'react-native';
import ViewPdfButton from '../screens/ViewPdfButton';
import TransportNotesButton from '../screens/TransportNotesButton';

const SongDetailOptions = ({ navigation, route }: any) => {
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
